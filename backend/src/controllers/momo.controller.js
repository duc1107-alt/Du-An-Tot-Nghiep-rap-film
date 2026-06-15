const axios = require('axios');
const crypto = require('crypto');
const Payment = require('../models/Payment.model');
const Booking = require('../models/Booking.model');

const createPayment = async (req, res) => {
  try {
    const { bookingId, amount, orderInfo } = req.body;
    if (!bookingId || !amount) return res.status(400).json({ error: 'Missing bookingId or amount' });

    const partnerCode = process.env.MOMO_PARTNER_CODE;
    const accessKey = process.env.MOMO_ACCESS_KEY;
    const secretKey = process.env.MOMO_SECRET_KEY;
    const redirectUrl = process.env.MOMO_REDIRECT_URL; // frontend
    const ipnUrl = process.env.MOMO_IPN_URL; // backend callback

    const orderId = `ORDER_${Date.now()}`;
    const requestId = `REQ_${Date.now()}`;
    const requestType = 'captureMoMoWallet';
    const extraData = '';

    const rawSignature = `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo || ''}&partnerCode=${partnerCode}&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=${requestType}`;
    const signature = crypto.createHmac('sha256', secretKey).update(rawSignature).digest('hex');

    const body = {
      partnerCode,
      accessKey,
      requestId,
      amount: String(amount),
      orderId,
      orderInfo: orderInfo || 'Payment for booking',
      redirectUrl,
      ipnUrl,
      extraData,
      requestType,
      signature,
    };

    const momoEndpoint = process.env.MOMO_ENDPOINT || 'https://test-payment.momo.vn/v2/gateway/api/create';
    const r = await axios.post(momoEndpoint, body, { timeout: 10000 });

    // Create Payment record (pending)
    await Payment.create({
      booking: bookingId,
      paymentMethod: 'momo',
      transactionId: orderId,
      amount: Number(amount),
      status: 'pending',
    });

    return res.json({ payUrl: r.data.payUrl, raw: r.data });
  } catch (error) {
    console.error('createPayment error', error?.response?.data || error.message);
    return res.status(500).json({ error: 'Failed to create Momo payment' });
  }
};

const momoCallback = async (req, res) => {
  try {
    const payload = req.body;
    const secretKey = process.env.MOMO_SECRET_KEY;

    const {
      partnerCode,
      accessKey,
      requestId,
      orderId,
      amount,
      orderInfo,
      orderType,
      transId,
      message,
      responseTime,
      resultCode,
      extraData,
      signature: momoSignature,
    } = payload;

    const raw = `accessKey=${accessKey}&amount=${amount}&extraData=${extraData || ''}&message=${message || ''}&orderId=${orderId}&orderInfo=${orderInfo || ''}&orderType=${orderType || ''}&partnerCode=${partnerCode}&payType=${payload.payType || ''}&requestId=${requestId || ''}&responseTime=${responseTime || ''}&resultCode=${resultCode}`;
    const expected = crypto.createHmac('sha256', secretKey).update(raw).digest('hex');

    if (expected !== momoSignature) {
      console.warn('Momo callback invalid signature', { expected, momoSignature });
      return res.status(400).send('Invalid signature');
    }

    // Find payment by orderId (we stored orderId as transactionId)
    const payment = await Payment.findOne({ transactionId: orderId }).populate('booking');
    if (!payment) {
      console.warn('Momo callback: payment not found', orderId);
      return res.status(404).json({ error: 'Payment not found' });
    }

    const numericAmount = Number(amount);
    if (payment.amount !== numericAmount) {
      console.warn('Momo callback amount mismatch', { expected: payment.amount, got: numericAmount });
      // continue but mark failed
      payment.status = 'failed';
      await payment.save();
      return res.json({ status: 'amount_mismatch' });
    }

    if (Number(resultCode) === 0) {
      payment.status = 'completed';
      await payment.save();

      // Update booking payment status if applicable
      if (payment.booking) {
        await Booking.findByIdAndUpdate(payment.booking._id, { paymentStatus: 'paid' });
      }
    } else {
      payment.status = 'failed';
      await payment.save();
    }

    return res.json({ status: 'ok' });
  } catch (error) {
    console.error('momoCallback error', error.message);
    return res.status(500).json({ error: 'Callback processing failed' });
  }
};

module.exports = { createPayment, momoCallback };

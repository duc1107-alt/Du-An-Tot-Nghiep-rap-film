import axios from 'axios';

const API = axios.create({ baseURL: import.meta.env.VITE_API_BASE || '/api' });

export async function createMomoPayment({ bookingId, amount, orderInfo }) {
  const r = await API.post('/payments/momo/create', { bookingId, amount, orderInfo });
  return r.data;
}

export default { createMomoPayment };

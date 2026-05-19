import { useSelector, useDispatch } from 'react-redux';
import {
  setSelectShowtime,
  toggleSeatSelection,
  updateConcessionQuantity,
  clearBookingFlow,
  setBookingLoading,
  setBookingSuccess,
  setBookingFailure,
} from '../store/bookingSlice';
import bookingService from '../services/booking.service';

export const useBooking = () => {
  const dispatch = useDispatch();
  const { selectedShowtime, selectedSeats, selectedConcessions, bookingDetails, loading, error } =
    useSelector((state) => state.booking);

  const selectShowtime = (showtime) => {
    dispatch(setSelectShowtime(showtime));
  };

  const selectSeat = (seatCode) => {
    dispatch(toggleSeatSelection(seatCode));
  };

  const changeConcessionQty = (concessionId, quantity) => {
    dispatch(updateConcessionQuantity({ concessionId, quantity }));
  };

  const clearBooking = () => {
    dispatch(clearBookingFlow());
  };

  // Pricing calculations
  const calculateTotal = (concessionsList = []) => {
    if (!selectedShowtime) return { seatsTotal: 0, concessionsTotal: 0, grandTotal: 0 };

    const basePrice = selectedShowtime.ticketPrice;

    // Calculate seats price
    let seatsTotal = 0;
    selectedSeats.forEach((seatCode) => {
      // Split seat A1 -> A & 1
      const match = seatCode.match(/^([A-Z]+)(\d+)$/);
      let addition = 0;
      if (match) {
        const row = match[1];
        // VIP seat rows are usually F, G, H in standard seeding
        // Couple rows are usually J in standard seeding
        if (['F', 'G', 'H'].includes(row)) {
          addition = 20000;
        } else if (['I', 'J'].includes(row)) {
          addition = 40000;
        }
      }
      seatsTotal += basePrice + addition;
    });

    // Calculate concessions price
    let concessionsTotal = 0;
    Object.keys(selectedConcessions).forEach((concessionId) => {
      const quantity = selectedConcessions[concessionId];
      const concessionDetails = concessionsList.find((c) => c._id === concessionId);
      if (concessionDetails) {
        concessionsTotal += concessionDetails.price * quantity;
      }
    });

    const grandTotal = seatsTotal + concessionsTotal;

    return {
      seatsTotal,
      concessionsTotal,
      grandTotal,
    };
  };

  const submitBooking = async (paymentMethod = 'card') => {
    if (!selectedShowtime || selectedSeats.length === 0) {
      throw new Error('Please select showtime and seats before booking');
    }

    dispatch(setBookingLoading(true));
    try {
      // Prepare payload
      const concessionsPayload = Object.keys(selectedConcessions).map((id) => ({
        concessionId: id,
        quantity: selectedConcessions[id],
      }));

      const payload = {
        showtimeId: selectedShowtime._id,
        seats: selectedSeats,
        concessions: concessionsPayload,
        paymentMethod,
      };

      const result = await bookingService.createBooking(payload);
      dispatch(setBookingSuccess(result));
      return result;
    } catch (err) {
      dispatch(setBookingFailure(err.message));
      throw err;
    }
  };

  return {
    selectedShowtime,
    selectedSeats,
    selectedConcessions,
    bookingDetails,
    loading,
    error,
    selectShowtime,
    selectSeat,
    changeConcessionQty,
    clearBooking,
    calculateTotal,
    submitBooking,
  };
};

export default useBooking;

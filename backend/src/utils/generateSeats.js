const Seat = require('../models/Seat.model');

/**
 * Generate standard, VIP, and couple seats for a cinema room
 * @param {string} roomId - ObjectId of the room
 * @param {number} standardRowsCount - Number of rows for standard seats (e.g. 5 for A, B, C, D, E)
 * @param {number} vipRowsCount - Number of rows for VIP seats (e.g. 3 for F, G, H)
 * @param {number} coupleRowsCount - Number of rows for Couple seats (e.g. 1 for J)
 * @param {number} seatsPerRow - Number of seats per row (e.g. 10 or 12)
 * @returns {Promise<Array>} List of generated seat documents
 */
const generateSeatsForRoom = async (
  roomId,
  standardRowsCount = 5,
  vipRowsCount = 3,
  coupleRowsCount = 1,
  seatsPerRow = 10
) => {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const seats = [];

  let rowIdx = 0;

  // 1. Standard rows
  for (let i = 0; i < standardRowsCount; i++) {
    const rowLetter = alphabet[rowIdx++];
    for (let num = 1; num <= seatsPerRow; num++) {
      seats.push({
        room: roomId,
        row: rowLetter,
        number: num,
        type: 'standard',
        price: 0, // standard seat has 0 additional price
      });
    }
  }

  // 2. VIP rows
  for (let i = 0; i < vipRowsCount; i++) {
    const rowLetter = alphabet[rowIdx++];
    for (let num = 1; num <= seatsPerRow; num++) {
      seats.push({
        room: roomId,
        row: rowLetter,
        number: num,
        type: 'vip',
        price: 20000, // VIP seat costs 20k extra (VND example)
      });
    }
  }

  // 3. Couple rows
  for (let i = 0; i < coupleRowsCount; i++) {
    const rowLetter = alphabet[rowIdx++];
    // Couple seats are wider, usually fewer per row (e.g. seatsPerRow / 2)
    const coupleSeatsCount = Math.floor(seatsPerRow / 2);
    for (let num = 1; num <= coupleSeatsCount; num++) {
      seats.push({
        room: roomId,
        row: rowLetter,
        number: num,
        type: 'couple',
        price: 40000, // Couple seat costs 40k extra
      });
    }
  }

  // Save all seats to the database
  const createdSeats = await Seat.insertMany(seats);
  return createdSeats;
};

module.exports = { generateSeatsForRoom };

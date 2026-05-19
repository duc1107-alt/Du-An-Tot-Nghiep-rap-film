const mongoose = require('mongoose');

const SeatSchema = new mongoose.Schema(
  {
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Room',
      required: true,
    },
    row: {
      type: String, // e.g. 'A', 'B'
      required: true,
      trim: true,
    },
    number: {
      type: Number, // e.g. 1, 2, 3
      required: true,
    },
    type: {
      type: String,
      enum: ['standard', 'vip', 'couple'],
      default: 'standard',
    },
    price: {
      type: Number, // Additional cost or base cost of the seat
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate seats in the same room
SeatSchema.index({ room: 1, row: 1, number: 1 }, { unique: true });

module.exports = mongoose.model('Seat', SeatSchema);

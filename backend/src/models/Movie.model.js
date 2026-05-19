const mongoose = require('mongoose');

const MovieSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a movie title'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide a movie description'],
    },
    duration: {
      type: Number, // in minutes
      required: [true, 'Please provide movie duration in minutes'],
    },
    genre: {
      type: [String],
      required: [true, 'Please provide movie genres'],
    },
    language: {
      type: String,
      required: [true, 'Please provide movie language'],
    },
    releaseDate: {
      type: Date,
      required: [true, 'Please provide release date'],
    },
    posterUrl: {
      type: String,
      required: [true, 'Please provide a poster URL'],
    },
    trailerUrl: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['now-showing', 'coming-soon', 'ended'],
      default: 'now-showing',
    },
    rating: {
      type: String, // e.g. T16, T18, P, C13
      required: [true, 'Please provide content rating label (e.g. PG-13, R)'],
    },
    director: {
      type: String,
      default: '',
    },
    cast: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Movie', MovieSchema);

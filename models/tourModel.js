//Create schema for tour
const mongoose = require('mongoose');
const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please enter the name of the tour'],
    unique: true,
  },
  rating: {
    type: Number,
  },
  price: {
    type: Number,
    required: [true, 'Please enter the price'],
  },
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;

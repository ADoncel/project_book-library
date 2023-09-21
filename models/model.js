const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: {
    required: true,
    type: String
  },
  comments: [],
});

module.exports = {
  Book: mongoose.model('Book', bookSchema),
}
const mongoose = require('mongoose');

const  centerSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: true,
    minlength: 8,
    maxlength: 17,
  }
});

module.exports = mongoose.model('center', centerSchema);

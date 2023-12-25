const mongoose = require("mongoose");

const repairSchema = new mongoose.Schema({
  date: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 20,
  },
  description: {
    type: String,
    required: true,
    minlength: 15,
  },
  operationTime: {
    type: Number,
    required: true,
    minlength: 2,
    maxlength: 6,
  },
  center: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "center",
    required: true,
  },
  responsible: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  aipNumber: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "aip",
    required: true,
  },
});

module.exports = mongoose.model('repair', repairSchema);


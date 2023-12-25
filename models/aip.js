const mongoose = require("mongoose");

const aipSchema = new mongoose.Schema({
  internalNumber: {
    type: Number,
    required: true,
    minlength: 1,
    maxlength: 2,
  },
  serialNumber: {
    type: Number,
    unique: true,
    required: true,
    minlength: 5,
    maxlength: 7,
  },
  inventoryNumber: {
    type: String,
    unique: true,
    minlength: 6,
    maxlength: 12,
  },
  REF: {
    type: Number,
    required: true,
    minlength: 5,
    maxlength: 7,
  },
  startUsing: {
    type: Number,
    required: true,
    minlength: 3,
    maxlength: 4,
  },
  software: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 5,
  },
  responsible: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  center: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "center",
    required: true,
  },
  place: {
    type: String,
  },
  condition: {
    type: String,
    required: true, 
    enum: [
      "Исправный",
      "Неисправный",
      "Требует калибровки",
      "Повышенное внимание",
    ],
  },
});

module.exports = mongoose.model('aip', aipSchema);

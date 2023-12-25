const mongoose = require("mongoose");

const journalSchema = new mongoose.Schema({
  date: {
    type: String,
    required: true
  },
  responsible: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  description:  {
    type: String,
    required: true,
    minlength: 15,
  },
  center:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "center",
    required: true,
  },
});

module.exports = mongoose.model('journal', journalSchema);

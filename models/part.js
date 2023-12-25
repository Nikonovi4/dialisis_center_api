const mongoose = require("mongoose");

const partSchema = new mongoose.Schema({
  partNumber:{
    type: String,
    minlength: 4,
    maxlength: 12,
  },
  partName: {
    type: String,
    minlength: 4,
    maxlength: 12,
  },
  creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
  },
  center: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "center",
    required: true,
  },
  createDate: {
    type: String,
    require: true
  },
  installOn: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "aip",
  },
  installer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  installDate: {
    type: String
  }
});

module.exports = mongoose.model('part', partSchema);
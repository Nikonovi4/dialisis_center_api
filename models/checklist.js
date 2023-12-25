const mongoose = require("mongoose");

const checklistSchema = new mongoose.Schema({
  leak: {
    type: Boolean,
    required: true,
  },
  consumption: {
    type: Number,
    required: true,
  },
  checkClock: {
    type: Boolean,
    required: true,
  },
  pressureIn: {
    type: Number,
    required: true,
  },
  pressureM1: {
    type: Number,
    required: true,
  },
  pressureM2: {
    type: Number,
    required: true,
  },
  rw: {
    type: Number,
    required: true,
  },
  permeate: {
    type: Number,
    required: true,
  },
  temp: {
    type: Number,
    required: true,
  },
  rj: {
    type: Number,
    required: true,
  },
  pressureMO2: {
    type: Number,
    required: true,
  },
  pressureMO3: {
    type: Number,
    required: true,
  },
  pressureMO4: {
    type: Number,
    required: true,
  },
  pressureMO5: {
    type: Number,
    required: true,
  },
  flushingFilter: {
    type: Boolean,
    required: true,
  },
  dg: {
    type: Boolean,
    required: true,
  },
  salt: {
    type: Boolean,
    required: true,
  },
  errOsmos: {
    type: Boolean,
    required: true,
  },
  errHotDisinfection: {
    type: Boolean,
    required: true,
  },
  errCSS: {
    type: Boolean,
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
  date: {
    type: String,
    required: true,
    unique: true,
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
});

module.exports = mongoose.model("checklist", checklistSchema);

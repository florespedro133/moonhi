const mongoose = require("mongoose");

const LogSchema = new mongoose.Schema({
  operation: String,
  inputs: Object,
  result: Number,
  timestamp: Date,
  responseTime: Number,
});

module.exports = mongoose.model("Log", LogSchema);

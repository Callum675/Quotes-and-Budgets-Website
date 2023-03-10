const mongoose = require("mongoose");

const workerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  payGrade: {
    type: String,
    enum: ["junior", "standard", "senior"],
    required: true,
  },
  hourlyRate: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("Worker", workerSchema);

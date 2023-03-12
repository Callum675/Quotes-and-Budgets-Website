const mongoose = require("mongoose");

const workerSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    auto: true,
  },
  name: {
    type: String,
    required: true,
  },
  payGrade: {
    type: String,
    enum: ["junior", "standard", "senior"],
    required: true,
  },
  manHours: {
    type: Number,
    required: true,
  },
});

const Worker = mongoose.model("Worker", workerSchema);
module.exports = Worker;

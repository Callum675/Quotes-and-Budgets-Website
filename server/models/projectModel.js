const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  workers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Worker",
    },
  ],
  resources: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Resource",
    },
  ],
  fudgeFactor: {
    type: Number,
    default: 1.0,
  },
});

module.exports = mongoose.model("Project", projectSchema);

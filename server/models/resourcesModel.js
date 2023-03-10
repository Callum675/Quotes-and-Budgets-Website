const mongoose = require("mongoose");

const resourceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  cost: {
    type: Number,
    required: true,
  },
  recurring: {
    type: Boolean,
    default: false,
  },
  interval: {
    type: String,
    enum: ["hour", "day", "week", "month", "year"],
    default: "month",
  },
});

module.exports = mongoose.model("Resource", resourceSchema);

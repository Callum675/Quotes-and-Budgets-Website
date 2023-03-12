const mongoose = require("mongoose");

const resourcesSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    auto: true,
  },
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

const Resources = mongoose.model("Resources", resourcesSchema);
module.exports = Resources;

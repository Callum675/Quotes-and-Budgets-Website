const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      auto: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    description: {
      type: String,
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
        ref: "Resources",
      },
    ],
    totalCost: {
      type: Number,
      default: 0,
    },
    fudgeFactor: {
      type: Number,
      default: 1.0,
    },
  },
  {
    timestamps: true,
  }
);

const Project = mongoose.model("Project", projectSchema);
module.exports = Project;

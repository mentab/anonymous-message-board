const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const boardSchema = new Schema(
  {
    title: { type: String, required: true },
    threads: [{ type: Schema.Types.ObjectId, ref: "Thread" }]
  },
  {
    timestamps: {
      createdAt: "created_on",
      updatedAt: "bumped_on"
    }
  }
);

module.exports = mongoose.model("Board", boardSchema);

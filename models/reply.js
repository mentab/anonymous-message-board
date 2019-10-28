const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const replySchema = new Schema(
  {
    text: { type: String, required: true },
    delete_password: { type: String, required: true },
    reported: { type: Boolean, default: false }
  },
  {
    timestamps: {
      createdAt: "created_on",
      updatedAt: "bumped_on"
    }
  }
);

// TODO delete if no parent

module.exports = mongoose.model("Reply", replySchema);

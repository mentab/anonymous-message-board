const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const threadSchema = new Schema(
  {
    text: { type: String, required: true },
    delete_password: { type: String, required: true },
    reported: { type: Boolean, default: false },
    replies: [{ type: Schema.Types.ObjectId, ref: "Reply" }]
  },
  {
    timestamps: {
      createdAt: "created_on",
      updatedAt: "bumped_on"
    }
  }
);

threadSchema.set('toObject', { virtuals: true })
threadSchema.set('toJSON', { virtuals: true })

threadSchema.virtual("replycount").get(function() {
  return this.replies.length;
});

// TODO delete if no parent

module.exports = mongoose.model("Thread", threadSchema);

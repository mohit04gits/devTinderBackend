const mongoose = require("mongoose");
const connectionRequestSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: ["ignored", "accepted", "interested", "rejected"],
        message: `{VALUE} is incorrect status type`,
      },
    },
  },
  { timestamps: true }
);

//connectionRequestSchema.find({fromUserId: ,toUserId:})
//connectionRequestSchema.index({fromUserId: 1, toUserId:1});



connectionRequestSchema.pre("save", function (next) {
  if (this.fromUserId.equals(this.toUserId)) {
    return next(new Error("Cannot send a request to yourself"));
  }
  next();
});

const ConnectionRequestModel = new mongoose.model(
    "ConnectionRequest",
    connectionRequestSchema
);

module.exports = ConnectionRequestModel;
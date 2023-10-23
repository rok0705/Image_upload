const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    hashedPassword: { type: String, required: true },
    sessions: [
      {
        createdAt: { type: Date, required: true },
      },
    ],
  },
  { timestamp: true }
);

module.exports = mongoose.model("user", UserSchema);

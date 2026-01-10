import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  phone: {
    type: String,
    required: true,
    index: true
  },

  otp: {
    type: String,
    required: true
  },

  purpose: {
    type: String,
    enum: ["signup", "login", "reset_password"],
    required: true
  },

  status: {
    type: String,
    enum: ["pending", "used", "expired"],
    default: "pending"
  },

  attempts: {
    type: Number,
    default: 0
  },

  expiresAt: {
    type: Date,
    required: true,
    index: { expires: "0s" } // 🔥 Auto-delete expired OTP
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Otp = mongoose.model("Otp", otpSchema);

export default Otp;

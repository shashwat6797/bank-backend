import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  id: {
    type: String,
    unique: true,
    required: true,
  },
  email: {
    type: String,
    unique: true,
  },
  imgUrl: String,
});

const userModel = new mongoose.model("userModel", userSchema);

export { userModel };

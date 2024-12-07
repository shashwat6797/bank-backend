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

const banckAccountSchema = new mongoose.Schema({
  userId: String,
  bankId: String,
  accountId: String,
  accessToken: String,
  sharableId: String,
});

const userModel = new mongoose.model("userModel", userSchema);
const bankAccountModel = new mongoose.model(
  "bankAccountModel",
  banckAccountSchema,
);

export { userModel, bankAccountModel };

import express from "express";
import { userModel } from "../model/userModel.js";

const userRoutes = express.Router();

userRoutes.post("/clerkWebhook", async (req, res) => {
  const { data } = await req.body;
  const newUser = await userModel.create({
    firstName: data.first_name,
    lastName: data.last_name,
    id: data.id,
    imgUrl: data.image_url,
    email: data.email_addresses[0].email_address,
  });
  console.log(newUser);
  res.json({ message: "received", status: 200 });
});

export default userRoutes;

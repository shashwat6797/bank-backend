import express from "express";
import { userModel } from "../model/userModel.js";
import { createUser } from "../controller/userController.js";

const userRoutes = express.Router();

userRoutes.post("/clerkWebhook", createUser);

userRoutes.get("/test", (req, res) => {
  res.send({ status: 200, mssg: "works" });
});

export default userRoutes;

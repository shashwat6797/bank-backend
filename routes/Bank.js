import express from "express";
import {
  getAccount,
  getAccounts,
  getTransactions,
} from "../controller/bankController.js";

const bankRoutes = express.Router();

bankRoutes.get("/getAccounts", getAccounts);

bankRoutes.get("/getAccount", getAccount);

export default bankRoutes;

import express from "express";
import {
  createLinkToken,
  exchangeToken,
} from "../controller/plaidController.js";

const plaidRoutes = express.Router();

plaidRoutes.get("/createLinkToken", createLinkToken);

plaidRoutes.post("/exchangeToken", exchangeToken);

export default plaidRoutes;

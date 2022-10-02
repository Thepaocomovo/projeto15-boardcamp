import express from "express";

import * as customersController from "../controllers/Customers.controller.js";
import validCustomer from "../middlewares/ValidCustomer.middleware.js";
import existentUser from "../middlewares/ExistentUser.middleware.js";

const router = express.Router();

router.post("/customers", validCustomer, existentUser, customersController.createCustomers);

export default router;
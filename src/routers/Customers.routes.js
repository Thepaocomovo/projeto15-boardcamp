import express from "express";

import * as customersController from "../controllers/Customers.controller.js";
import validCustomer from "../middlewares/ValidCustomer.middleware.js";
import existentUser from "../middlewares/ExistentUser.middleware.js";
import CPFpossibleUpdate from "../middlewares/UpdateCpf.middleware.js";
const router = express.Router();

router.get("/customers", customersController.getCustomers);
router.get("/customers/:id", customersController.getCustomersById);
router.post("/customers", validCustomer, existentUser, customersController.createCustomers);
router.put("/customers/:id", validCustomer, CPFpossibleUpdate, customersController.updateUser);



export default router;
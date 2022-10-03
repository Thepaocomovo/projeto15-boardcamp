import express from "express";

import * as rentalsController from "../controllers/Rentals.controller.js";
import existentCustomerId from "../middlewares/ExistentCustomerId.middleware.js";
import existentGame from "../middlewares/ExistentGameForRent.middleware.js";

const router = express.Router();

router.get("/rentals", rentalsController.getRentals);
// router.get("/rentals/:id", customersController.getCustomersById);
router.post("/rentals", existentCustomerId, existentGame, rentalsController.createRental);
// router.put("/rentals/:id", validCustomer, CPFpossibleUpdate, customersController.updateUser);



export default router;
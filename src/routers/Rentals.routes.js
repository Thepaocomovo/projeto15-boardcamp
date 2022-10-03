import express from "express";

import * as rentalsController from "../controllers/Rentals.controller.js";
import existentCustomerId from "../middlewares/ExistentCustomerId.middleware.js";
import existentGame from "../middlewares/ExistentGameForRent.middleware.js";
import avaiableRentalToClose from "../middlewares/AvaiableRentalToClose.middleware.js";


const router = express.Router();

router.get("/rentals", rentalsController.getRentals);
router.post("/rentals", existentCustomerId, existentGame, rentalsController.createRental);
router.post("/rentals/:id/return", avaiableRentalToClose, rentalsController.closeRental)
router.delete("/rentals/:id",  rentalsController.deleteRental);

export default router;
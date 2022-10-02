import express from "express";

import * as gamesController from "../controllers/Games.controller.js";
import gameRequirements from "../middlewares/GamesRequirements.middleware.js";

const router = express.Router();

router.get("/games", gamesController.getGames);
router.post("/games", gameRequirements, gamesController.createGames);

export default router;
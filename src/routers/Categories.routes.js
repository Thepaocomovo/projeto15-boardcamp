import express from "express";

import * as categoriesController from "../controllers/Categories.controller.js";
import HasValidCategorie from "../middlewares/HasValidCategorie.middleware.js";
const router = express.Router();

router.get("/categories", categoriesController.getCategories);
router.post("/categories", HasValidCategorie, categoriesController.createCategories);

export default router;
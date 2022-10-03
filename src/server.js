import dotenv from "dotenv";
import express from "express";
import cors from "cors";

import categoriesRouter from "./routers/Categories.routes.js";
import gamesRouter from "./routers/Games.routes.js";
import CustomersRouter from "./routers/Customers.routes.js";
import RentalsRouter from "./routers/Rentals.routes.js";

dotenv.config();
const server = express();

server.use(express.json());
server.use(cors());

server.use(categoriesRouter);
server.use(gamesRouter);
server.use(CustomersRouter);
server.use(RentalsRouter);

server.get("/status", (req, res) => {
  res.sendStatus(200);
});

server.listen(process.env.PORT, () => { console.log(`listen on ${process.env.PORT}`) });
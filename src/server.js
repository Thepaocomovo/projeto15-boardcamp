import dotenv from "dotenv";
import express from "express";
import cors from "cors";
// import connection from "./database/PgConnection.js";

import categoriesRouter from "./routers/Categories.routes.js";

dotenv.config();
const server = express();

server.use(express.json());
server.use(cors());

server.use(categoriesRouter);

server.get("/status", (req, res) => {
  res.sendStatus(200);
});

// server.get("/status", async (req, res) => {
//   const teste = await connection.query("SELECT * FROM games;");
//   res.status(200).send(teste.rows);
// });

server.listen(process.env.PORT, () => { console.log(`listen on ${process.env.PORT}`) });
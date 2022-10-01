import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import pg from 'pg';

dotenv.config(); 
const server = express();

server.use(express.json());
server.use(cors());

const { Pool } = pg;

const connection = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  server.get("/status", (req, res) => {
    res.sendStatus(200);
  });

  // server.get("/status", async (req, res) => {
  //   const teste = await connection.query("SELECT * FROM games;");

server.listen(process.env.PORT, () => { console.log(`listen on ${process.env.PORT}`) });
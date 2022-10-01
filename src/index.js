import dotenv from "dotenv";
import express from "express";
import cors from "cors";

dotenv.config(); 
const server = express();

server.use(express.json());
server.use(cors());

server.listen(process.env.PORT, () => { console.log(`listen on ${process.env.PORT}`) });
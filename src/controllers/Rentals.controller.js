import { StatusCodes } from "http-status-codes";
import dayjs from "dayjs";

import connection from "../database/PgConnection.js";


const getRentals = async (req, res) => {

    res.sendStatus(StatusCodes.OK);
};

const createRental = async (req, res) => {
    const { customerId, gameId, daysRented } = req.body;
    const time = dayjs(Date()).format('YYYY-MM-DD');
   const originalPrice = res.locals.originalPrice;

    if (isNaN(Number(daysRented)) || daysRented < 1) {
        return res.sendStatus(StatusCodes.BAD_REQUEST);
    }

    try {
        await connection.query(`
            INSERT INTO rentals
            ("customerId", "gameId", "daysRented", "rentDate", "returnDate", "originalPrice", "delayFee")
            VALUES ($1, $2, $3, $4, $5, $6, $7);
        `, [customerId, gameId, daysRented, time, null, originalPrice, null]
        ) 
    } catch (error) {
        console.log(error);
        return res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
    }

    res.sendStatus(201);
};


export { getRentals, createRental };
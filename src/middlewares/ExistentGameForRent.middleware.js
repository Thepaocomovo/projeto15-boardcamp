import joi from "joi";
import { StatusCodes } from "http-status-codes";
import { stripHtml } from "string-strip-html";

import connection from "../database/PgConnection.js";


const existentGame = async (req, res, next) => {
    const { daysRented, gameId } = req.body;
    let originalPrice;
    let existentGame;

    try {
        existentGame = await connection.query(`
            SELECT * 
            FROM games 
            WHERE id = $1;`, [gameId]
        )

        if (existentGame.rows.length < 1) {
            return res.sendStatus(StatusCodes.BAD_REQUEST)
        }
    } catch (error) {
        console.log(error);
        return res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
    }

    try {
        let rentedGames = await connection.query(`
            SELECT * 
            FROM rentals 
            WHERE "gameId" = $1;`, [gameId]
        )
        rentedGames = rentedGames.rows.filter((rental) => rental.returnDate === null)

        if(rentedGames.length >= existentGame.rows[0].stockTotal) {
            res.sendStatus(StatusCodes.BAD_REQUEST)
        }

    } catch (error) {
        console.log(error);
        return res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
    }

    originalPrice = daysRented * existentGame.rows[0].pricePerDay
    res.locals.originalPrice = originalPrice
    next()
};

export default existentGame;
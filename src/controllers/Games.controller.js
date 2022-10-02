import { StatusCodes } from "http-status-codes";

import connection from "../database/PgConnection.js";

const getGames = async (req, res) => {
    try {
        const games = await connection.query(`
            SELECT games.*, categories.name as "categoryName"
            FROM games JOIN categories 
            ON games."categoryId" = categories.id;`
        );
        return res.status(StatusCodes.OK).send(games.rows);
    } catch (error) {
        console.log(error);
        return res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

const createGames = async (req, res) => {
    const { name, image, stockTotal, categoryId, pricePerDay } = res.locals.newGame;

    try {
        await connection.query(`
            INSERT INTO games 
            (name, image, "stockTotal", "categoryId", "pricePerDay") 
            VALUES ($1, $2, $3, $4, $5);`, [name, image, stockTotal, categoryId, pricePerDay]
        );
        return res.sendStatus(StatusCodes.CREATED);
    } catch (error) {
        console.log(error);
        return res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
    }
};

export { getGames, createGames };
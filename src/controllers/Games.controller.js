import { StatusCodes } from "http-status-codes";

import connection from "../database/PgConnection.js";

const createGames = async (req, res) => {
    const { name, image, stockTotal, categoryId, pricePerDay } = res.locals.newGame;

    try {
        await connection.query(`INSERT INTO games 
            (name, image, "stockTotal", "categoryId", "pricePerDay") 
            VALUES ($1, $2, $3, $4, $5);`, [name, image, stockTotal, categoryId, pricePerDay ]
        )
        res.sendStatus(StatusCodes.CREATED);
    } catch (error) {
        console.log(error);
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
    }
};

export { createGames };
import { StatusCodes } from "http-status-codes";

import connection from "../database/PgConnection.js";

const avaiableRentalToClose = async (req, res, next) => {
    const { id } = req.params;

    try {
        const existentRental = await connection.query(`
            SELECT *
            FROM rentals
            WHERE id = $1;`, [id]
            ) 
            if(existentRental.rows.length < 1) {
                return res.sendStatus(StatusCodes.BAD_REQUEST);
            }
            if(existentRental.rows[0].returnDate !== null) {
                return res.sendStatus(StatusCodes.BAD_REQUEST);
            }
            res.locals.existentRental = existentRental.rows[0];
    } catch (error) {
        console.log(error);
        return res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
    }

    next();
};

export default avaiableRentalToClose
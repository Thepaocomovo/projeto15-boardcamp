import { StatusCodes } from "http-status-codes";

import connection from "../database/PgConnection.js";


const existentCustomerId = async (req, res, next) => {
    const id = req.body.customerId

    try {
        const existentUser = await connection.query(`
            SELECT * 
            FROM customers 
            WHERE id = $1;`, [id]
        )
        if(existentUser.rows.length < 1){
            return res.sendStatus(StatusCodes.BAD_REQUEST)
        }
    } catch (error) {
        console.log(error);
        return res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
    }

    next()
};

export default existentCustomerId;
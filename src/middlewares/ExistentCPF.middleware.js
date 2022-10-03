import { StatusCodes } from "http-status-codes";

import connection from "../database/PgConnection.js";

const existentUser = async (req, res, next) => {
    const cpf = res.locals.newCustomer.cpf;

    try {
        const user = await connection.query(`
        SELECT * FROM customers 
        WHERE cpf = $1;`, [`${cpf}`]
        );
        if(user.rows.length > 0) {
            return res.sendStatus(StatusCodes.CONFLICT);
        }
    } catch (error) {
        console.log(error);
        return res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
    }
      
    next();
}

export default existentUser;
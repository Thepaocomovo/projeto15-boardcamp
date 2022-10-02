import { StatusCodes } from "http-status-codes";

import connection from "../database/PgConnection.js";

const CPFpossibleUpdate = async (req, res, next) => {
    const cpf = res.locals.newCustomer.cpf;
    const id = req.params.id;
    if(!Number(id)){
        return res.sendStatus(StatusCodes.BAD_REQUEST)
    }

    try {
        const user = await connection.query(`
        SELECT * FROM customers 
        WHERE cpf = $1;`, [`${cpf}`]
        );
        if(user.rows.length > 0) {
            if(`${user.rows[0].id}` !== `${id}`){
                return res.sendStatus(StatusCodes.CONFLICT);
            }
        }
    } catch (error) {
        console.log(error);
        return res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
    }
   
    next();
}

export default CPFpossibleUpdate;
import { StatusCodes } from "http-status-codes";

import connection from "../database/PgConnection.js";
const getCustomers = async (req, res) => {
    try {
        const customersList = await connection.query(`
            SELECT * FROM customers;

        `);
        return res.status(StatusCodes.OK).send(customersList.rows)
    } catch (error) {
        console.log(error);
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

const createCustomers = async (req, res) => {
    const { name, phone, cpf, birthday } = res.locals.newCustomer;

    try {
        await connection.query(`
        INSERT INTO customers 
        (name, phone, cpf, birthday) 
        VALUES ($1, $2, $3, $4);`, [name, phone, cpf, birthday]);
        return res.sendStatus(StatusCodes.CREATED)
    } catch (error) {
        console.log(error);
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
    }
    res.sendStatus(StatusCodes.CREATED);
};


export { getCustomers, createCustomers }
import { StatusCodes } from "http-status-codes";

import connection from "../database/PgConnection.js";
const getCustomers = async (req, res) => {
    if(req.query.cpf) {
        const costumerCPF = req.query.cpf;
        try {
            const costumer = await connection.query(`
            SELECT *
            FROM customers
            WHERE cpf LIKE $1;`, [`${costumerCPF}%`]
            );
            return res.status(StatusCodes.OK).send(costumer.rows);
        } catch (error) {
            console.log(error);
            return res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }

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

const getCustomersById = async (req, res) => {
    const id = req.params.id;
    if(!Number(id)){
        return res.sendStatus(StatusCodes.BAD_REQUEST)
    }
    try {
        const costumer = await connection.query(`
        SELECT *
        FROM customers
        WHERE id = $1;`, [`${id}`]
        );

        if(costumer.rows.length < 1) return res.sendStatus(StatusCodes.NOT_FOUND);

        return res.status(StatusCodes.OK).send(costumer.rows);
    } catch (error) {
        console.log(error);
        return res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
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


export { getCustomers, createCustomers, getCustomersById }
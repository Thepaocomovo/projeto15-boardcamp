import { StatusCodes } from "http-status-codes";
import dayjs from "dayjs";

import connection from "../database/PgConnection.js";

const getCustomers = async (req, res) => {
    if(req.query.cpf) {
        const costumerCPF = req.query.cpf;
        try {
            let costumer = await connection.query(`
            SELECT *
            FROM customers
            WHERE cpf LIKE $1;`, [`${costumerCPF}%`]
            );

            costumer = costumer.rows.map((v) => {
                return(
                    {
                    id: v.id,
                    name: v.name,
                    phone: v.phone,
                    cpf: v.cpf,
                    birthday: (dayjs(v.birthday).format('YYYY-MM-DD'))
                }
                )
            })

            return res.status(StatusCodes.OK).send(costumer);
        } catch (error) {
            console.log(error);
            return res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }

    try {
        let customersList = await connection.query(`
            SELECT * FROM customers;
        `);
        customersList = customersList.rows.map((v) => {
            return(
                {
                id: v.id,
                name: v.name,
                phone: v.phone,
                cpf: v.cpf,
                birthday: (dayjs(v.birthday).format('YYYY-MM-DD'))
            }
            )
        })
        return res.status(StatusCodes.OK).send(customersList)
    } catch (error) {
        console.log(error);
        return res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
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
        const birthday = (dayjs(costumer.rows[0].birthday).format('YYYY-MM-DD'));
        costumer.rows[0].birthday = birthday;
        
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
        VALUES ($1, $2, $3, $4);`, [name, phone, cpf, birthday]
        );
        return res.sendStatus(StatusCodes.CREATED)
    } catch (error) {
        console.log(error);
        return res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
    }
    return res.sendStatus(StatusCodes.CREATED);
};

const updateUser = async (req, res) => {
    const { name, phone, cpf, birthday } = res.locals.newCustomer;
    const id = req.params.id;

    try {
        await connection.query(`
            UPDATE customers 
            SET name = $1, phone = $2, cpf = $3, birthday = $4  
            WHERE id = $5;
            `, [name, phone, cpf, birthday, id]
        );
        return res.sendStatus(StatusCodes.OK);
    } catch (error) {
        console.log(error);
        return res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

export { getCustomers, getCustomersById, createCustomers, updateUser }
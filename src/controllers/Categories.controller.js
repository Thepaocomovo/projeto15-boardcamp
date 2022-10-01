import { StatusCodes } from "http-status-codes";

import connection from "../database/PgConnection.js";

const getCategories = async (req, res) => {
    try {
        const categories = await connection.query("SELECT * FROM categories;");
        return res.status(StatusCodes.OK).send(categories.rows);
    } catch (error) {
        console.log(error);
        return res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
    }
};

const createCategories = async (req, res) => {
    const { name } = res.locals.newCategorie;
    try {
        await connection.query("INSERT INTO categories (name) VALUES ($1);", [name]);
        res.sendStatus(StatusCodes.CREATED);
    } catch (error) {
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
    }
};


export { getCategories, createCategories };
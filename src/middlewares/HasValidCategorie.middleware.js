import joi from "joi";
import { StatusCodes } from "http-status-codes";
import { stripHtml } from "string-strip-html";

import connection from "../database/PgConnection.js";

const newCategorieSchema = joi.object({
    name: joi.string().required().trim(),
});

const HasValidCategorie = async (req, res, next) => {
    const { name } = req.body;
    const validation = newCategorieSchema.validate({ name }, { abortEarly: false });
    if (validation.error) {
        return res.status(StatusCodes.BAD_REQUEST).send(validation.error.message);
    }
    const newCategorie = {
        name: stripHtml(name).result
    };

    try {
        const existentCategorie = await connection.query("SELECT * FROM categories WHERE name = $1", [newCategorie.name]);
        if (existentCategorie.rows.length > 0) {
            return res.sendStatus(StatusCodes.CONFLICT);
        }
    } catch (error) {
        console.log(error);
        return res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
    }

    res.locals.newCategorie = newCategorie;

    next();
}

export default HasValidCategorie;
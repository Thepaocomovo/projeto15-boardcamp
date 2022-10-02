import joi from "joi";
import { StatusCodes } from "http-status-codes";
import { stripHtml } from "string-strip-html";

import connection from "../database/PgConnection.js";

const newGameSchema = joi.object({
    name: joi.string().required().trim(),
    image: joi.string().required().trim(),
    stockTotal: joi.number().integer().min(1).required(),
    pricePerDay: joi.number().integer().min(1).required(),
    categoryId: joi.number().integer().min(1).required()
});

const gameRequirements = async (req, res, next) => {
    let { name, image, stockTotal, categoryId, pricePerDay } = req.body;
    const validation = newGameSchema.validate({
        name, image, stockTotal, categoryId, pricePerDay
    }, { abortEarly: false });

    if (validation.error) {
        return res.status(StatusCodes.BAD_REQUEST).send(validation.error.message);
    }

    try {
        const existentCategorie = await connection.query(`SELECT * FROM categories WHERE id = $1`, [categoryId]);
        if (existentCategorie.rows.length < 1) {
            return res.sendStatus(StatusCodes.BAD_REQUEST);
        }
    } catch (error) {
        console.log(error);
        return res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
    }

        //verificar se image é valida
    
    name = stripHtml(name.toLowerCase()).result;
    image = stripHtml(image).result;
  
    try {
        const existentGame = await connection.query(`SELECT * FROM games WHERE name = $1`, [name]);
        if (existentGame.rows.length > 0) {
            return res.sendStatus(StatusCodes.CONFLICT);
        }
    } catch (error) {
        console.log(error);
        return res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
    }

    res.locals.newGame = { name, image, stockTotal, categoryId, pricePerDay };

    next();
}


export default gameRequirements;
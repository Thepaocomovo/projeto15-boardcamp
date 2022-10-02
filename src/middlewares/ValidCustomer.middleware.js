import joi from "joi";
import { StatusCodes } from "http-status-codes";
import { stripHtml } from "string-strip-html";

import connection from "../database/PgConnection.js";

const newCostumerSchema = joi.object({
    name: joi.string().required().trim(),
    phone: joi.string().required().min(10).max(11).regex(/^\d+$/).trim(),
    cpf: joi.string().required().min(11).max(11).regex(/^\d+$/).trim(),
    birthday: joi.string().required().regex(/^\d{4}-\d{2}-\d{2}$/).trim()
});

const validCustomer = async (req, res, next) => {
    let { name, phone, cpf, birthday } = req.body;
    const validation = newCostumerSchema.validate({ name, phone, cpf, birthday }, { abortEarly: false });

    if (validation.error) {
        return res.status(StatusCodes.BAD_REQUEST).send(validation.error.message);
    }
    name = stripHtml(name.toLowerCase()).result;

    res.locals.newCustomer = { name, phone, cpf, birthday };
    
    next();
}

export default validCustomer;
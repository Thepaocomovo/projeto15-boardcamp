import { StatusCodes } from "http-status-codes";
import dayjs from "dayjs";

import connection from "../database/PgConnection.js";

const getRentals = async (req, res) => {
    if (req.query.customerId) {
        if (isNaN(Number(req.query.customerId))) {
            return res.sendStatus(StatusCodes.BAD_REQUEST);
        }

        try {
            let rentalsList = await connection.query(`
                SELECT 
                    rentals.*, 
                    customers.name, 
                    games.name as "gamesName", games."categoryId", 
                    categories.name as "categoryName"
                FROM rentals
                JOIN customers
                ON rentals."customerId" = customers.id
                JOIN games
                ON rentals."gameId" = games.id
                JOIN categories
                ON games."categoryId" = categories.id
                WHERE rentals."customerId" = $1
                ;`, [`${req.query.customerId}`]
            )

            rentalsList = rentalsList.rows.map((v) => {
                return (
                    {
                        id: v.id,
                        customerId: v.customerId,
                        gameId: v.gameId,
                        rentDate:  dayjs(v.rentDate).format('YYYY-MM-DD'),
                        daysRented: v.daysRented,
                        returnDate: v.returnDate,
                        originalPrice: v.originalPrice,
                        delayFee: v.delayFee,
                        customer: {
                            id: v.customerId,
                            name: v.name
                        },
                        game: {
                            id: v.gameId,
                            name: v.gamesName,
                            categoryId: v.categoryId,
                            categoryName: v.categoryName
                        }
                    }
                )
            })
            return res.status(StatusCodes.CREATED).send(rentalsList);
        } catch (error) {
            console.log(error);
            return res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }

    if (req.query.gameId) {
        if (isNaN(Number(req.query.gameId))) {
            return res.sendStatus(StatusCodes.BAD_REQUEST);
        }

        try {
            let rentalsList = await connection.query(`
                SELECT 
                    rentals.*, 
                    customers.name, 
                    games.name as "gamesName", games."categoryId", 
                    categories.name as "categoryName"
                FROM rentals
                JOIN customers
                ON rentals."customerId" = customers.id
                JOIN games
                ON rentals."gameId" = games.id
                JOIN categories
                ON games."categoryId" = categories.id
                WHERE rentals."gameId" = $1
                ;`, [`${req.query.gameId}`]
            )
            rentalsList = rentalsList.rows.map((v) => {
                return (
                    {
                        id: v.id,
                        customerId: v.customerId,
                        gameId: v.gameId,
                        rentDate: dayjs(v.rentDate).format('YYYY-MM-DD'),
                        daysRented: v.daysRented,
                        returnDate: v.returnDate,
                        originalPrice: v.originalPrice,
                        delayFee: v.delayFee,
                        customer: {
                            id: v.customerId,
                            name: v.name
                        },
                        game: {
                            id: v.gameId,
                            name: v.gamesName,
                            categoryId: v.categoryId,
                            categoryName: v.categoryName
                        }
                    }
                )
            })

            return res.status(StatusCodes.CREATED).send(rentalsList);
        } catch (error) {
            console.log(error);
            return res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }

    try {
        let rentalsList = await connection.query(`
            SELECT 
                rentals.*, 
                customers.name, 
                games.name as "gamesName", games."categoryId", 
                categories.name as "categoryName"
            FROM rentals
            JOIN customers
                ON rentals."customerId" = customers.id
            JOIN games
                ON rentals."gameId" = games.id
            JOIN categories
                ON games."categoryId" = categories.id;
        `)

        rentalsList = rentalsList.rows.map((v) => {
            return (
                {
                    id: v.id,
                    customerId: v.customerId,
                    gameId: v.gameId,
                    rentDate: dayjs(v.rentDate).format('YYYY-MM-DD'),
                    daysRented: v.daysRented,
                    returnDate: v.returnDate,
                    originalPrice: v.originalPrice,
                    delayFee: v.delayFee,
                    customer: {
                        id: v.customerId,
                        name: v.name
                    },
                    game: {
                        id: v.gameId,
                        name: v.gamesName,
                        categoryId: v.categoryId,
                        categoryName: v.categoryName
                    }
                }
            )
        })

        return res.status(StatusCodes.OK).send(rentalsList);
    } catch (error) {
        console.log(error);
        return res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
    }
};

const createRental = async (req, res) => {
    const { customerId, gameId, daysRented } = req.body;
    const time = dayjs(Date()).format('YYYY-MM-DD');
    const originalPrice = res.locals.originalPrice;

    if (isNaN(Number(daysRented)) || daysRented < 1) {
        return res.sendStatus(StatusCodes.BAD_REQUEST);
    }

    try {
        await connection.query(`
            INSERT INTO rentals
            ("customerId", "gameId", "daysRented", "rentDate", "returnDate", "originalPrice", "delayFee")
            VALUES ($1, $2, $3, $4, $5, $6, $7);
        `, [customerId, gameId, daysRented, time, null, originalPrice, null]
        )
    } catch (error) {
        console.log(error);
        return res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
    }

    return res.sendStatus(201);
};

const closeRental = async (req, res) => {
    const { id } = req.params;
    const { rentDate, originalPrice, daysRented } = res.locals.existentRental;
    let delayFee = 0
    const time = dayjs(Date()).$d;
    const difference = time - rentDate;
    const days = Math.floor(difference / (1000 * 3600 * 24));
    const today = dayjs(Date()).format('YYYY-MM-DD')
    if (days > daysRented) {
        const delay = days - daysRented;
        const fee = (originalPrice / daysRented)
        delayFee = delay * fee;
    }

    try {
        await connection.query(`
        UPDATE rentals 
        SET "returnDate" = $1, "delayFee" = $2
        WHERE id = $3;
        `, [today, delayFee, id]
        );
    } catch (error) {
        console.log(error);
        return res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
    }

    return res.sendStatus(StatusCodes.OK);
};

const deleteRental = async (req, res) => {
    const { id } = req.params;

    try {
        const existentRental = await connection.query(`
            SELECT * FROM rentals WHERE id = $1
        `, [id]
        );

        if (existentRental.rows.length < 1) {
            return res.sendStatus(StatusCodes.NOT_FOUND);
        }
        if (existentRental.rows[0].returnDate === null) {
            return res.sendStatus(StatusCodes.BAD_REQUEST);
        }
    } catch (error) {
        console.log(error);
        return res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
    }

    try {
        await connection.query(`
            DELETE FROM rentals WHERE id = $1
            `, [id]
        );

    } catch (error) {
        console.log(error);
        return res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
    }

    return res.sendStatus(StatusCodes.OK);
}

export { getRentals, createRental, closeRental, deleteRental };
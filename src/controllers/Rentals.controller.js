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
                ON rentals."gameId" = customers.id
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
                        rentDate: v.rentDate,
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
                ON rentals."gameId" = customers.id
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
                        rentDate: v.rentDate,
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
                ON rentals."gameId" = customers.id
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
                    rentDate: v.rentDate,
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
    console.log(time);
    console.log(typeof (time))
    const originalPrice = res.locals.originalPrice;

    if (isNaN(Number(daysRented)) || daysRented < 1) {
        return res.sendStatus(StatusCodes.BAD_REQUEST);
    }

    try {
        console.log(time);
        await connection.query(`
            INSERT INTO rentals
            ("customerId", "gameId", "daysRented", "rentDate", "returnDate", "originalPrice", "delayFee")
            VALUES ($1, $2, $3, $4, $5, $6, $7);
        `, [customerId, gameId, daysRented, time, null, originalPrice, null]
        )
        console.log(time);
    } catch (error) {
        console.log(error);
        return res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
    }

    res.sendStatus(201);
};

export { getRentals, createRental };
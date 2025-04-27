const express = require("express");
const app = express();
const fs = require("fs");
const winston = require("winston");

const logger = winston.createLogger({
    level: "info",
    format: winston.format.json(),
    defaultMeta: { service: "math-service" },
    transports: [
        new winston.transports.File({ filename: "error.log", level: "error" }),
        new winston.transports.File({ filename: "combined.log" }),
    ],
});

if (process.env.NODE_ENV !== "production") {
    logger.add(
        new winston.transports.Console({
            format: winston.format.simple(),
        })
    );
}

// Math functions
const add = (n1, n2) => n1 + n2;
const subtract = (n1, n2) => n1 - n2;
const multiply = (n1, n2) => n1 * n2;
const divide = (n1, n2) => {
    if (n2 === 0) {
        throw new Error("Division by zero");
    }
    return n1 / n2;
};


const parseNumbers = (req, res) => {
    const n1 = parseFloat(req.query.n1);
    const n2 = parseFloat(req.query.n2);

    if (isNaN(n1)) {
        logger.error("n1 is incorrectly defined");
        throw new Error("n1 is incorrectly defined");
    }
    if (isNaN(n2)) {
        logger.error("n2 is incorrectly defined");
        throw new Error("n2 is incorrectly defined");
    }

    return { n1, n2 };
};


app.get("/add", (req, res) => {
    try {
        const { n1, n2 } = parseNumbers(req, res);
        logger.info(`Adding ${n1} and ${n2}`);
        const result = add(n1, n2);
        res.status(200).json({ statuscode: 200, data: result });
    } catch (error) {
        logger.error(error.toString());
        res.status(500).json({ statuscode: 500, msg: error.toString() });
    }
});

app.get("/subtract", (req, res) => {
    try {
        const { n1, n2 } = parseNumbers(req, res);
        logger.info(`Subtracting ${n2} from ${n1}`);
        const result = subtract(n1, n2);
        res.status(200).json({ statuscode: 200, data: result });
    } catch (error) {
        logger.error(error.toString());
        res.status(500).json({ statuscode: 500, msg: error.toString() });
    }
});

app.get("/multiply", (req, res) => {
    try {
        const { n1, n2 } = parseNumbers(req, res);
        logger.info(`Multiplying ${n1} and ${n2}`);
        const result = multiply(n1, n2);
        res.status(200).json({ statuscode: 200, data: result });
    } catch (error) {
        logger.error(error.toString());
        res.status(500).json({ statuscode: 500, msg: error.toString() });
    }
});

app.get("/divide", (req, res) => {
    try {
        const { n1, n2 } = parseNumbers(req, res);
        logger.info(`Dividing ${n1} by ${n2}`);
        const result = divide(n1, n2);
        res.status(200).json({ statuscode: 200, data: result });
    } catch (error) {
        logger.error(error.toString());
        res.status(500).json({ statuscode: 500, msg: error.toString() });
    }
});

const port = 3040;
app.listen(port, () => {
    console.log("Hello SIT 737");
    console.log(`Listening on port ${port}...`);
});

import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import morgan from "morgan";
import chalk from "chalk";
import config from "config";
import path from "path";
import { fileURLToPath } from "url";

import UsersRouter from "./controllers/users.js";
import CardsRouter from "./controllers/cards.js";
import initialData from "./services/initialData.js";
import logger from "./services/logger.js";

await mongoose.connect(config.get("MONGO_URL"));
console.info(chalk.green("mongodb connection"));

await initialData();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());

app.use(cors({
    origin: config.get("FRONTEND_URL"),
    credentials: true,
    methods: "GET,PUT,POST,DELETE,PATCH,OPTIONS",
    allowedHeaders: "Content-Type, Accept, Authorization",
}));

app.use(morgan((tokens, req, res) => {
    const status = Number(tokens.status(req, res));

    const message = [
        tokens.date(req, res, "iso"),
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        `${tokens["response-time"](req, res)} ms`,
    ].join(" ");

    if (status >= 400) {
        logger(message);
    }

    return status >= 400
        ? chalk.red(message)
        : chalk.green(message);
}));

app.use("/users", UsersRouter);
app.use("/cards", CardsRouter);

app.use(express.static(path.join(__dirname, "public")));

app.use((req, res) => {
    res.status(404).send({ message: "Resource not found" });
});

app.use((err, req, res, next) => {
    console.error(chalk.red(err.message));

    if (err.name === "CastError") {
        return res.status(400).send({
            message: "Invalid id",
        });
    }

    res.status(err.status || 500).send({
        message: err.message || "Internal server error",
    });
});

app.listen(config.get("PORT"), () => {
    console.info(chalk.cyan(`listening on port ${config.get("PORT")}`));
});
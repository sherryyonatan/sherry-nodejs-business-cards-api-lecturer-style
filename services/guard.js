import jwt from "jsonwebtoken";
import config from "config";

export default (req, res, next) => {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).send({ message: "User is not authorized" });
    }

    jwt.verify(token, config.get("JWT_SECRET"), (err, data) => {
        if (err) {
            return res.status(401).send({ message: "User is not authorized" });
        }

        next();
    });
};

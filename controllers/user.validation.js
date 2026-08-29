import { UserJoiSchema } from "./user.joi.js";

export default (req, res, next) => {
    const { error } = UserJoiSchema.validate(req.body, {
        abortEarly: false,
        stripUnknown: true,
    });

    if (error) {
        return res.status(400).send({
            error: error.details.map(item => item.message),
        });
    }

    next();
};

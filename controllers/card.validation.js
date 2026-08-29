import { CardJoiSchema } from "./card.joi.js";

export default (req, res, next) => {
    const { error } = CardJoiSchema.validate(req.body, {
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

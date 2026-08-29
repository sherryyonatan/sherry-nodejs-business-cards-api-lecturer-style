import Joi from "joi";

const nameSchema = Joi.object({
    first: Joi.string().min(2).max(256).required(),
    middle: Joi.string().allow("").max(256),
    last: Joi.string().min(2).max(256).required(),
});

const imageSchema = Joi.object({
    url: Joi.string().uri().allow(""),
    alt: Joi.string().allow("").max(256),
});

const addressSchema = Joi.object({
    state: Joi.string().allow("").max(256),
    country: Joi.string().min(2).max(256).required(),
    city: Joi.string().min(2).max(256).required(),
    street: Joi.string().min(2).max(256).required(),
    houseNumber: Joi.number().integer().min(1).required(),
    zip: Joi.number().integer().min(0),
});

export const UserJoiSchema = Joi.object({
    name: nameSchema.required(),
    isBusiness: Joi.boolean().required(),
    phone: Joi.string().min(9).max(15).required(),
    email: Joi.string().email().required(),
    password: Joi.string()
        .min(7)
        .max(20)
        .pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*]).+$/)
        .required(),
    address: addressSchema.required(),
    image: imageSchema.required(),
});

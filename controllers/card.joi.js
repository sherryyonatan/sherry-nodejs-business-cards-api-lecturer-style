import Joi from "joi";

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

export const CardJoiSchema = Joi.object({
    title: Joi.string().min(2).max(256).required(),
    subtitle: Joi.string().min(2).max(256).required(),
    description: Joi.string().min(2).max(1024).required(),
    phone: Joi.string().min(9).max(15).required(),
    email: Joi.string().email().required(),
    web: Joi.string().uri().required(),
    image: imageSchema.required(),
    address: addressSchema.required(),
});

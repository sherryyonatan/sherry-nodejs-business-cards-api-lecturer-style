import { model, Schema } from "mongoose";

const NameSchema = new Schema({
    first: String,
    middle: String,
    last: String,
});

const ImageSchema = new Schema({
    url: String,
    alt: String,
});

const AddressSchema = new Schema({
    state: String,
    country: String,
    city: String,
    street: String,
    houseNumber: Number,
    zip: Number,
});

const UserSchema = new Schema({
    name: NameSchema,
    phone: String,
    email: { type: String, unique: true, lowercase: true },
    password: String,
    image: ImageSchema,
    address: AddressSchema,
    isAdmin: { type: Boolean, default: false },
    isBusiness: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
});

export const User = model("users", UserSchema);

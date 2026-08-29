import { model, Schema } from "mongoose";

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

const CardSchema = new Schema({
    title: String,
    subtitle: String,
    description: String,
    phone: String,
    email: String,
    web: String,
    image: ImageSchema,
    address: AddressSchema,
    bizNumber: { type: Number, unique: true },
    likes: [{ type: Schema.Types.ObjectId, ref: "users" }],
    user_id: { type: Schema.Types.ObjectId, ref: "users", index: true },
    createdAt: { type: Date, default: Date.now },
});

export const Card = model("cards", CardSchema);

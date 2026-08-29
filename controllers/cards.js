import { Router } from "express";

import { Card } from "../models/Card.js";
import guard from "../services/guard.js";
import { getCurrentUser } from "../services/utilities.js";
import { createBizNumber } from "../services/cardsUtilities.js";
import validateCard from "./card.validation.js";

const router = Router();

router.get("/", async (req, res) => {
    const cards = await Card.find();
    res.send(cards);
});

router.get("/my-cards", guard, async (req, res) => {
    const currentUser = getCurrentUser(req);
    const cards = await Card.find({ user_id: currentUser._id });
    res.send(cards);
});

router.get("/:id", async (req, res) => {
    const card = await Card.findById(req.params.id);

    if (!card) {
        return res.status(404).send({ message: "Card not found" });
    }

    res.send(card);
});

router.post("/", guard, validateCard, async (req, res) => {
    const currentUser = getCurrentUser(req);

    if (!currentUser.isBusiness) {
        return res.status(403).send({ message: "Business user authorization required" });
    }

    const card = new Card({
        ...req.body,
        bizNumber: await createBizNumber(),
        likes: [],
        user_id: currentUser._id,
    });

    const newCard = await card.save();
    res.status(201).send(newCard);
});

router.put("/:id", guard, validateCard, async (req, res) => {
    const currentUser = getCurrentUser(req);
    const card = await Card.findById(req.params.id);

    if (!card) {
        return res.status(404).send({ message: "Card not found" });
    }

    if (card.user_id.toString() !== currentUser._id) {
        return res.status(403).send({ message: "User is not authorized" });
    }

    card.title = req.body.title;
    card.subtitle = req.body.subtitle;
    card.description = req.body.description;
    card.phone = req.body.phone;
    card.email = req.body.email;
    card.web = req.body.web;
    card.image = req.body.image;
    card.address = req.body.address;

    await card.save();
    res.send(card);
});

router.patch("/:id", guard, async (req, res) => {
    const currentUser = getCurrentUser(req);
    const card = await Card.findById(req.params.id);

    if (!card) {
        return res.status(404).send({ message: "Card not found" });
    }

    const liked = card.likes.some(id => id.toString() === currentUser._id);

    if (liked) {
        card.likes = card.likes.filter(id => id.toString() !== currentUser._id);
    } else {
        card.likes.push(currentUser._id);
    }

    await card.save();
    res.send(card);
});

router.patch("/:id/biz-number", guard, async (req, res) => {
    const currentUser = getCurrentUser(req);

    if (!currentUser.isAdmin) {
        return res.status(403).send({ message: "Admin authorization required" });
    }

    const card = await Card.findById(req.params.id);

    if (!card) {
        return res.status(404).send({ message: "Card not found" });
    }

    const { bizNumber } = req.body;

    if (!bizNumber || !Number.isInteger(bizNumber)) {
        return res.status(400).send({ message: "Valid bizNumber is required" });
    }

    const existingCard = await Card.findOne({
        bizNumber,
        _id: { $ne: card._id },
    });

    if (existingCard) {
        return res.status(400).send({ message: "bizNumber already exists" });
    }

    card.bizNumber = bizNumber;
    await card.save();

    res.send(card);
});

router.delete("/:id", guard, async (req, res) => {
    const currentUser = getCurrentUser(req);
    const card = await Card.findById(req.params.id);

    if (!card) {
        return res.status(404).send({ message: "Card not found" });
    }

    const isOwner = card.user_id.toString() === currentUser._id;

    if (!isOwner && !currentUser.isAdmin) {
        return res.status(403).send({ message: "User is not authorized" });
    }

    await Card.findByIdAndDelete(req.params.id);
    res.send(card);
});

export default router;
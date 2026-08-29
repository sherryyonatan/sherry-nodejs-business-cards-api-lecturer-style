import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import config from "config";

import { User } from "../models/User.js";
import guard from "../services/guard.js";
import { getCurrentUser, userWithoutPassword } from "../services/utilities.js";
import validateUser from "./user.validation.js";

const router = Router();

router.post("/", validateUser, async (req, res) => {
    const userFind = await User.findOne({ email: req.body.email });

    if (userFind) {
        return res.status(400).send({ message: "User already exists" });
    }

    const user = new User({
        ...req.body,
        password: await bcrypt.hash(req.body.password, 10),
        isAdmin: false,
    });

    const newUser = await user.save();
    res.status(201).send(userWithoutPassword(newUser));
});

router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    const userFind = await User.findOne({ email });

    if (!userFind) {
        return res.status(401).send({ message: "email or password incorrect" });
    }

    const passwordMatch = await bcrypt.compare(password, userFind.password);

    if (!passwordMatch) {
        return res.status(401).send({ message: "email or password incorrect" });
    }

    const obj = {
        _id: userFind._id,
        isBusiness: userFind.isBusiness,
        isAdmin: userFind.isAdmin,
    };

    const token = jwt.sign(obj, config.get("JWT_SECRET"), { expiresIn: "24h" });
    res.send(token);
});

router.get("/", guard, async (req, res) => {
    const currentUser = getCurrentUser(req);

    if (!currentUser.isAdmin) {
        return res.status(403).send({ message: "Admin authorization required" });
    }

    const users = await User.find();
    res.send(users.map(userWithoutPassword));
});

router.get("/:id", guard, async (req, res) => {
    const currentUser = getCurrentUser(req);

    if (currentUser._id !== req.params.id && !currentUser.isAdmin) {
        return res.status(403).send({ message: "User is not authorized" });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
        return res.status(404).send({ message: "User not found" });
    }

    res.send(userWithoutPassword(user));
});

router.put("/:id", guard, validateUser, async (req, res) => {
    const currentUser = getCurrentUser(req);

    if (currentUser._id !== req.params.id) {
        return res.status(403).send({ message: "User is not authorized" });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
        return res.status(404).send({ message: "User not found" });
    }

    user.name = req.body.name;
    user.phone = req.body.phone;
    user.email = req.body.email;
    user.password = await bcrypt.hash(req.body.password, 10);
    user.image = req.body.image;
    user.address = req.body.address;
    user.isBusiness = req.body.isBusiness;

    await user.save();
    res.send(userWithoutPassword(user));
});

router.patch("/:id", guard, async (req, res) => {
    const currentUser = getCurrentUser(req);

    if (currentUser._id !== req.params.id) {
        return res.status(403).send({ message: "User is not authorized" });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
        return res.status(404).send({ message: "User not found" });
    }

    user.isBusiness = !user.isBusiness;
    await user.save();
    res.send(userWithoutPassword(user));
});

router.delete("/:id", guard, async (req, res) => {
    const currentUser = getCurrentUser(req);

    if (currentUser._id !== req.params.id && !currentUser.isAdmin) {
        return res.status(403).send({ message: "User is not authorized" });
    }

    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
        return res.status(404).send({ message: "User not found" });
    }

    res.send(userWithoutPassword(user));
});

export default router;

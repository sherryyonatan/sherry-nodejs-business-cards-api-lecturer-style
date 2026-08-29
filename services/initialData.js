import bcrypt from "bcryptjs";
import { User } from "../models/User.js";
import { Card } from "../models/Card.js";

const users = [
    ["Regular", "User", "regular@example.com", false, false, "0500000001"],
    ["Business", "User", "business@example.com", true, false, "0500000002"],
    ["Admin", "User", "admin@example.com", true, true, "0500000003"],
];

export default async function initialData() {
    if (await User.countDocuments() === 0) {
        for (const [first, last, email, isBusiness, isAdmin, phone] of users) {
            await new User({
                name: { first, middle: "", last },
                phone,
                email,
                password: await bcrypt.hash("Aa1234!", 10),
                image: { url: "", alt: `${first} ${last}` },
                address: {
                    state: "",
                    country: "Israel",
                    city: "Haifa",
                    street: "Main Street",
                    houseNumber: 1,
                    zip: 0,
                },
                isBusiness,
                isAdmin,
            }).save();
        }
    }

    if (await Card.countDocuments() === 0) {
        const businessUser = await User.findOne({ email: "business@example.com" });

        for (let i = 1; i <= 3; i++) {
            await new Card({
                title: `Business Card ${i}`,
                subtitle: `Business subtitle ${i}`,
                description: `Business description ${i}`,
                phone: `050100000${i}`,
                email: `card${i}@example.com`,
                web: `https://example${i}.com`,
                image: { url: "", alt: `Business Card ${i}` },
                address: {
                    state: "",
                    country: "Israel",
                    city: "Tel Aviv",
                    street: "Main Street",
                    houseNumber: i,
                    zip: 0,
                },
                bizNumber: 1000000 + i,
                likes: [],
                user_id: businessUser._id,
            }).save();
        }
    }
}

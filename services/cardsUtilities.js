import { Card } from "../models/Card.js";

export async function createBizNumber() {
    let bizNumber;
    let exists = true;

    while (exists) {
        bizNumber = Math.floor(1000000 + Math.random() * 9000000);
        exists = await Card.exists({ bizNumber });
    }

    return bizNumber;
}

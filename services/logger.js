import fs from "fs";
import path from "path";

const logsFolder = path.join(process.cwd(), "logs");

if (!fs.existsSync(logsFolder)) {
    fs.mkdirSync(logsFolder);
}

const logger = (message) => {
    const date = new Date().toISOString().split("T")[0];
    const filePath = path.join(logsFolder, `${date}.log`);

    fs.appendFileSync(filePath, `${message}\n`);
};

export default logger;
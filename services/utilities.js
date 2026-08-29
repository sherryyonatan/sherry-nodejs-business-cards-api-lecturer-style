import jwt from "jsonwebtoken";

export function getCurrentUser(req) {
    return jwt.decode(req.headers.authorization);
}

export function userWithoutPassword(user) {
    const obj = user.toObject ? user.toObject() : { ...user };
    delete obj.password;
    return obj;
}

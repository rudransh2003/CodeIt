import jwt from "jsonwebtoken";
import redisClient from "../services/redis.service.js";

export const authUser = async (req, res, next) => {
    try {
        // Safely extract token from cookies or authorization header
        let token = req.cookies.token;
        
        if (!token && req.headers.authorization) {
            const authHeader = req.headers.authorization;
            if (authHeader.startsWith('Bearer ')) {
                token = authHeader.split(' ')[1];
            }
        }
        
        if (!token) {
            return res.status(401).send({ error: 'Unauthorized User' });
        }

        const isBlackListed = await redisClient.get(token);
        if (isBlackListed) {
            res.cookie('token', '');
            return res.status(401).send({ error: 'Unauthorized User' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // checks the signed part of token against jwt secret key
        // The data inside JWT (like email or userId) is not encrypted, it's encoded (anyone can decode it).
        // But the signature is what makes the token secure. Only the server with the secret key can verify whether it's valid or tampered.
        req.user = decoded;
        next();
    } catch (error) {
        console.log(error);
        res.status(401).send({ error: 'Unauthorized User' });
    }
}
import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

const auth = (req: Request & { user?: any }, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JSONSECRET!) as JwtPayload;
        req.user = decoded.user._id
        next();
    } catch (error) {
        return res.status(403).json({ message: 'Invalid token' });
    }
};

export default auth;
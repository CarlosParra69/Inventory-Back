import jwt, { SignOptions } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET as string;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET as string;

const ACCESS_EXPIRES_IN = process.env.JWT_EXPIRES_IN as SignOptions['expiresIn'];
const REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN as SignOptions['expiresIn'];

export const generateAccessToken = (payload: object) => 
    jwt.sign(payload, JWT_SECRET, {
        expiresIn: ACCESS_EXPIRES_IN,
    });
export const generateRefreshToken = (payload: object) => 
    jwt.sign(payload, JWT_REFRESH_SECRET, {
        expiresIn: REFRESH_EXPIRES_IN,
    });    

export function verifyAccessToken(token: string) {
    return jwt.verify(token, JWT_SECRET);
}

export function verifyRefreshToken(token: string) {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET!);
}
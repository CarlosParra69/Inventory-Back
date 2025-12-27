import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../../../shared/utils/token';
import { JwtPayload } from '../interfaces/jwt.interface';

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ message: 'Token no proporcionado' });
    }

    const [scheme, token] = authHeader.split(' ');

    if (scheme !== 'Bearer' || !token) {
        return res.status(401).json({ message: 'Formato de token inválido' });
    }

    try {
        const decoded = verifyAccessToken(token) as JwtPayload;

    // Inyectamos solo lo necesario
    req.user = {
        id: decoded.sub,
        email: decoded.email,
        role: decoded.role
    };

        next();
    } catch (error) {
        return res.status(401).json({ message: 'Token inválido o expirado' });
    }
}


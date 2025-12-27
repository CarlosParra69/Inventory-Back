import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';

const service = new AuthService();

export class AuthController {

    // Iniciar sesión
    async login(req: Request, res: Response) {
        try {
            const { email, password } = req.body;
            const result = await service.login(email, password);
            return res.status(200).json(result);
        } catch (error: any) {
            return res.status(401).json({ message: error.message });
        }
    }

    // Registrar usuario
    async register(req: Request, res: Response) {
        try {
            const { name, email, password } = req.body;
            const user = await service.register(name, email, password);
            return res.status(201).json(user);
        } catch (error: any) {
            return res.status(400).json({ message: error.message });
        }
    }

    // Renovar access token
    async refreshToken(req: Request, res: Response) {
        try {
            const { refreshToken } = req.body;
            const result = await service.refreshToken(refreshToken);
            return res.status(200).json(result);
        } catch (error: any) {
            return res.status(401).json({ message: error.message });
        }
    }

    // Cerrar sesión
    async logout(req: Request, res: Response) {
        try {
            const { refreshToken } = req.body;
            await service.logout(refreshToken);
            return res.status(204).send();
        } catch (error: any) {
            return res.status(400).json({ message: error.message });
        }
    }
}

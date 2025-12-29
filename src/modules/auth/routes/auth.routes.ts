import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { validate } from '../../../shared/middlewares/validate';
import { loginSchema, registerSchema, logoutSchema, refreshTokenSchema } from '../dtos/auth.dto';
import { authMiddleware } from '../middlewares/auth.middleware';
import './swagger.api';

const router = Router();
const controller = new AuthController();

router.post('/login', validate(loginSchema), controller.login);
router.post('/register', validate(registerSchema), controller.register);
router.post('/refresh', validate(refreshTokenSchema), controller.refreshToken);
router.post('/logout', validate(logoutSchema), controller.logout);
router.get('/me', authMiddleware, controller.getMe);

export default router;


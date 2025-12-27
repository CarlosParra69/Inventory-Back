import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { validate } from '../../../shared/middlewares/validate';
import { loginSchema, registerSchema, logoutSchema } from '../dtos/auth.dto';
import './swagger.api';

const router = Router();
const controller = new AuthController();

router.post('/login', validate(loginSchema), controller.login);
router.post('/register', validate(registerSchema), controller.register);
router.post('/logout', validate(logoutSchema), controller.logout);

export default router;


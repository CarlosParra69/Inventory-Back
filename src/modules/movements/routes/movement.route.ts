import { Router } from 'express';
import { MovementController } from '../controllers/movement.controller';
import { authMiddleware } from '../../auth/middlewares/auth.middleware';
import { authorize } from '../../auth/middlewares/authorize.middleware';
import './swagger.api';

const router = Router();
const movementController = new MovementController();

// Rutas para movimientos - requieren autenticación (ADMIN y USER pueden acceder)
router.use(authMiddleware);

// Obtener todos los movimientos con paginación
router.get('/', authorize('ADMIN', 'USER'), movementController.getAll);

// Obtener movimientos de entrada (IN)
router.get('/entries', authorize('ADMIN', 'USER'), movementController.getEntries);

// Obtener movimientos de salida (OUT)
router.get('/exits', authorize('ADMIN', 'USER'), movementController.getExits);

// Obtener movimientos por producto
router.get('/product/:productId', authorize('ADMIN', 'USER'), movementController.getByProductId);

export default router;

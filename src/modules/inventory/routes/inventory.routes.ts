import { Router } from 'express';
import { InventoryController } from '../controllers/inventory.controller';
import { authMiddleware } from '../../auth/middlewares/auth.middleware';
import { authorize } from '../../auth/middlewares/authorize.middleware';
import './swagger.api';
import { audit } from '../../../shared/middlewares/audit.middleware';

const router = Router();
const controller = new InventoryController();

// Rutas de movimientos de inventario
router.use(authMiddleware); // Aplicar middleware de autenticación a todas las rutas
router.post('/in', authorize('ADMIN'), audit('CREATE', 'INVENTORY'), controller.entry);
router.post('/out', authorize('ADMIN'), audit('CREATE', 'INVENTORY'), controller.exit);
router.get('/stock', authorize('ADMIN', 'USER'), controller.stock);

export default router;
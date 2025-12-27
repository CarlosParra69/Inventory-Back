import { Router } from 'express';
import { ProductController } from '../controllers/product.controller';
import { authMiddleware } from '../../auth/middlewares/auth.middleware';
import { authorize } from '../../auth/middlewares/authorize.middleware';
import './swagger.api';
import { audit } from '../../../shared/middlewares/audit.middleware';

const router = Router();
const controller = new ProductController();

// Rutas para productos
router.use(authMiddleware); // Aplicar middleware de autenticación a todas las rutas
router.get('/', authorize('ADMIN', 'USER'), controller.getAll);
router.get('/:id', authorize('ADMIN', 'USER'), controller.getById);
router.post('/', authorize('ADMIN'), audit('CREATE', 'PRODUCT'), controller.create);
router.put('/:id', authorize('ADMIN'), audit('UPDATE', 'PRODUCT'), controller.update);
router.delete('/:id', authorize('ADMIN'), audit('SOFT_DELETE', 'PRODUCT'), controller.delete);
router.patch('/:id/restore', authorize('ADMIN'), audit('RESTORE', 'PRODUCT'), controller.restore);

export default router;
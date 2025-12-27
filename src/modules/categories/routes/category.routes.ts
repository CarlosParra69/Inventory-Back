import { Router } from 'express';
import { CategoryController } from '../controllers/category.controller';
import { authMiddleware } from '../../auth/middlewares/auth.middleware';
import { authorize } from '../../auth/middlewares/authorize.middleware';
import './swagger.api';
import { audit } from '../../../shared/middlewares/audit.middleware';

const router = Router();
const categoryController = new CategoryController();

// Rutas para categorías
router.use(authMiddleware); // Aplicar middleware de autenticación a todas las rutas
router.get('/', authorize('ADMIN', 'USER'), categoryController.getAll);
router.get('/:id', authorize('ADMIN', 'USER'), categoryController.getById);
router.post('/', authorize('ADMIN'), audit('CREATE', 'CATEGORY'), categoryController.create);
router.put('/:id', authorize('ADMIN'), audit('UPDATE', 'CATEGORY'), categoryController.update);
router.delete('/:id', authorize('ADMIN'), audit('SOFT_DELETE', 'CATEGORY'), categoryController.delete);
router.patch('/:id/restore', authorize('ADMIN'), audit('RESTORE', 'CATEGORY'), categoryController.restore);

export default router;
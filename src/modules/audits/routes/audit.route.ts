import { Router } from 'express';
import { AuditController } from '../controllers/audit.controller';
import { authMiddleware } from '../../auth/middlewares/auth.middleware';
import { authorize } from '../../auth/middlewares/authorize.middleware';
import './swagger.api';

const router = Router();
const auditController = new AuditController();

// Rutas para auditorías - requieren autenticación y rol ADMIN
router.use(authMiddleware);

// Obtener todas las auditorías con paginación
router.get('/', authorize('ADMIN'), auditController.getAll);

// Obtener auditorías por usuario
router.get('/user/:userId', authorize('ADMIN'), auditController.getByUserId);

// Obtener auditorías por recurso
router.get('/resource/:resourceId', authorize('ADMIN'), auditController.getByResourceId);

export default router;

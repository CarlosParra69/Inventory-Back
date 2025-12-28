import express from 'express';
import cors from 'cors';
import productRoutes from './modules/products/routes/product.routes';
import categoryRoutes from './modules/categories/routes/category.routes';
import inventoryRoutes from './modules/inventory/routes/inventory.routes';
import authRoutes from './modules/auth/routes/auth.routes';
import auditRoutes from './modules/audits/routes/audit.route';
import movementRoutes from './modules/movements/routes/movement.route';
import { errorHandler } from './shared/middlewares/error.middleware';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger';

const app = express();

// Midlewares Globales
app.use(cors());
app.use(express.json());
app.use(errorHandler);

// Rutas Principales
app.use('/api/audits', auditRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/movements', movementRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


// Ruta test monitoreo estado del api
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        message: 'API Inventarios Operativa'
    });
});    

export default app;
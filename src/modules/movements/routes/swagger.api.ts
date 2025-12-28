/**
 * @swagger
 * components:
 *   schemas:
 *     InventoryMovement:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           example: "550e8400-e29b-41d4-a716-446655440000"
 *         product_id:
 *           type: string
 *           format: uuid
 *           example: "f47ac10b-58cc-4372-a567-0e02b2c3d479"
 *         movement_type:
 *           type: string
 *           enum: [IN, OUT]
 *           example: "IN"
 *         quantity:
 *           type: number
 *           example: 50
 *         reason:
 *           type: string
 *           example: "Compra a proveedor"
 *         productName:
 *           type: string
 *           example: "Laptop Dell XPS 13"
 *         created_at:
 *           type: string
 *           format: date-time
 *           example: "2025-12-27T10:30:00Z"
 *
 *     Pagination:
 *       type: object
 *       properties:
 *         page:
 *           type: number
 *           example: 1
 *         limit:
 *           type: number
 *           example: 15
 *         total:
 *           type: number
 *           example: 50
 *         totalPages:
 *           type: number
 *           example: 4
 *
 *     PaginatedMovements:
 *       type: object
 *       properties:
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/InventoryMovement'
 *         pagination:
 *           $ref: '#/components/schemas/Pagination'
 */

/**
 * @swagger
 * /api/movements:
 *   get:
 *     summary: Obtener todos los movimientos de inventario
 *     description: >
 *       Retorna un listado paginado de todos los movimientos de inventario (entradas y salidas).
 *       Incluye información decodificada del nombre del producto.
 *       Paginación por defecto: 15 registros por página.
 *     tags:
 *       - Movements
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: number
 *           minimum: 1
 *           default: 1
 *         description: Número de página para la paginación
 *     responses:
 *       200:
 *         description: Movimientos obtenidos correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedMovements'
 *       401:
 *         description: No autorizado - Token inválido o ausente
 *       403:
 *         description: Acceso denegado - Se requiere ser ADMIN o USER
 *       500:
 *         description: Error interno del servidor
 */

/**
 * @swagger
 * /api/movements/entries:
 *   get:
 *     summary: Obtener movimientos de entrada (IN)
 *     description: >
 *       Retorna un listado paginado de todos los movimientos de entrada (incremento de stock).
 *     tags:
 *       - Movements
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: number
 *           minimum: 1
 *           default: 1
 *         description: Número de página para la paginación
 *     responses:
 *       200:
 *         description: Movimientos obtenidos correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedMovements'
 *       401:
 *         description: No autorizado - Token inválido o ausente
 *       403:
 *         description: Acceso denegado - Se requiere ser ADMIN o USER
 *       500:
 *         description: Error interno del servidor
 */

/**
 * @swagger
 * /api/movements/exits:
 *   get:
 *     summary: Obtener movimientos de salida (OUT)
 *     description: >
 *       Retorna un listado paginado de todos los movimientos de salida (decremento de stock).
 *     tags:
 *       - Movements
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: number
 *           minimum: 1
 *           default: 1
 *         description: Número de página para la paginación
 *     responses:
 *       200:
 *         description: Movimientos obtenidos correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedMovements'
 *       401:
 *         description: No autorizado - Token inválido o ausente
 *       403:
 *         description: Acceso denegado - Se requiere ser ADMIN o USER
 *       500:
 *         description: Error interno del servidor
 */

/**
 * @swagger
 * /api/movements/product/{productId}:
 *   get:
 *     summary: Obtener movimientos por producto
 *     description: >
 *       Retorna un listado paginado de todos los movimientos asociados a un producto específico.
 *       Muestra tanto entradas como salidas del producto.
 *     tags:
 *       - Movements
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID del producto
 *       - in: query
 *         name: page
 *         schema:
 *           type: number
 *           minimum: 1
 *           default: 1
 *         description: Número de página para la paginación
 *     responses:
 *       200:
 *         description: Movimientos obtenidos correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedMovements'
 *       401:
 *         description: No autorizado - Token inválido o ausente
 *       403:
 *         description: Acceso denegado - Se requiere ser ADMIN o USER
 *       500:
 *         description: Error interno del servidor
 */

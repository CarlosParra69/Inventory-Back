/**
 * @swagger
 * components:
 *   schemas:
 *     AuditLog:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           example: "550e8400-e29b-41d4-a716-446655440000"
 *         user_id:
 *           type: string
 *           format: uuid
 *           example: "8afac74a-af43-47dd-99d9-3c22afa3004d"
 *         role:
 *           type: string
 *           enum: [USER, ADMIN]
 *           example: "ADMIN"
 *         action:
 *           type: string
 *           enum: [CREATE, UPDATE, SOFT_DELETE, RESTORE]
 *           example: "CREATE"
 *         resource:
 *           type: string
 *           enum: [CATEGORY, PRODUCT, USER, INVENTORY]
 *           example: "CATEGORY"
 *         resource_id:
 *           type: string
 *           format: uuid
 *           example: "f47ac10b-58cc-4372-a567-0e02b2c3d479"
 *         ip:
 *           type: string
 *           example: "192.168.1.1"
 *         userName:
 *           type: string
 *           example: "Juan Pérez"
 *         resourceName:
 *           type: string
 *           example: "Electrónica"
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
 *     PaginatedAudits:
 *       type: object
 *       properties:
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/AuditLog'
 *         pagination:
 *           $ref: '#/components/schemas/Pagination'
 */

/**
 * @swagger
 * /api/audits:
 *   get:
 *     summary: Obtener todas las auditorías
 *     description: >
 *       Retorna un listado paginado de todas las auditorías registradas.
 *       Incluye información decodificada del usuario y el recurso afectado.
 *       Paginación por defecto: 15 registros por página.
 *     tags:
 *       - Audits
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
 *         description: Auditorías obtenidas correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedAudits'
 *       401:
 *         description: No autorizado - Token inválido o ausente
 *       403:
 *         description: Acceso denegado - Se requiere rol ADMIN
 *       500:
 *         description: Error interno del servidor
 */

/**
 * @swagger
 * /api/audits/user/{userId}:
 *   get:
 *     summary: Obtener auditorías por usuario
 *     description: >
 *       Retorna un listado paginado de auditorías realizadas por un usuario específico.
 *     tags:
 *       - Audits
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID del usuario
 *       - in: query
 *         name: page
 *         schema:
 *           type: number
 *           minimum: 1
 *           default: 1
 *         description: Número de página para la paginación
 *     responses:
 *       200:
 *         description: Auditorías obtenidas correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedAudits'
 *       401:
 *         description: No autorizado - Token inválido o ausente
 *       403:
 *         description: Acceso denegado - Se requiere rol ADMIN
 *       500:
 *         description: Error interno del servidor
 */

/**
 * @swagger
 * /api/audits/resource/{resourceId}:
 *   get:
 *     summary: Obtener auditorías por recurso
 *     description: >
 *       Retorna un listado paginado de auditorías realizadas sobre un recurso específico.
 *       Muestra todos los cambios y acciones realizadas sobre un producto, categoría, etc.
 *     tags:
 *       - Audits
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: resourceId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID del recurso (producto, categoría, etc.)
 *       - in: query
 *         name: page
 *         schema:
 *           type: number
 *           minimum: 1
 *           default: 1
 *         description: Número de página para la paginación
 *     responses:
 *       200:
 *         description: Auditorías obtenidas correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedAudits'
 *       401:
 *         description: No autorizado - Token inválido o ausente
 *       403:
 *         description: Acceso denegado - Se requiere rol ADMIN
 *       500:
 *         description: Error interno del servidor
 */

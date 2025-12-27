import { Router } from 'express';
/**
 * @swagger
 * components:
 *   schemas:
 *     InventoryMovement:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: 9f2c3a12-1234-5678-9012-acdeff123456
 *         product_id:
 *           type: string
 *           example: 9f2c3a12-1234-5678-9012-acdeff123456
 *         movement_type:
 *           type: string
 *           enum: [IN, OUT]
 *           example: IN
 *         quantity:
 *           type: number
 *           example: 10
 *         reason:
 *           type: string
 *           nullable: true
 *           example: Compra de proveedor
 *         created_at:
 *           type: string
 *           format: date-time
 *           example: 2024-01-15T10:30:00Z
 *
 *     InventoryEntryRequest:
 *       type: object
 *       required:
 *         - productId
 *         - quantity
 *       properties:
 *         productId:
 *           type: string
 *           example: 9f2c3a12-1234-5678-9012-acdeff123456
 *         quantity:
 *           type: number
 *           minimum: 1
 *           example: 10
 *         reason:
 *           type: string
 *           nullable: true
 *           example: Compra de proveedor
 *
 *     InventoryExitRequest:
 *       type: object
 *       required:
 *         - productId
 *         - quantity
 *       properties:
 *         productId:
 *           type: string
 *           example: 9f2c3a12-1234-5678-9012-acdeff123456
 *         quantity:
 *           type: number
 *           minimum: 1
 *           example: 5
 *         reason:
 *           type: string
 *           nullable: true
 *           example: Venta a cliente
 *
 *     StockItem:
 *       type: object
 *       properties:
 *         product_id:
 *           type: string
 *           example: 9f2c3a12-1234-5678-9012-acdeff123456
 *         product_name:
 *           type: string
 *           example: Laptop Dell XPS 15
 *         stock:
 *           type: number
 *           example: 25
 *
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: No hay suficiente stock para realizar la salida
 */
/**
 * @swagger
 * /api/inventory/in:
 *   post:
 *     summary: Registrar entrada de inventario
 *     tags: [Inventory]
 *     description: Registra una entrada de productos al inventario (aumenta el stock)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/InventoryEntryRequest'
 *     responses:
 *       201:
 *         description: Entrada de inventario registrada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InventoryMovement'
 *       400:
 *         description: Datos inválidos o cantidad menor o igual a cero
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: No autorizado - Token inválido o faltante
 *       500:
 *         description: Error interno del servidor
 */
/**
 * @swagger
 * /api/inventory/out:
 *   post:
 *     summary: Registrar salida de inventario
 *     tags: [Inventory]
 *     description: Registra una salida de productos del inventario (disminuye el stock)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/InventoryExitRequest'
 *     responses:
 *       201:
 *         description: Salida de inventario registrada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InventoryMovement'
 *       400:
 *         description: Datos inválidos, cantidad menor o igual a cero, o stock insuficiente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: No autorizado - Token inválido o faltante
 *       500:
 *         description: Error interno del servidor
 */
/**
 * @swagger
 * /api/inventory/stock:
 *   get:
 *     summary: Obtener stock actual de todos los productos
 *     tags: [Inventory]
 *     description: Retorna el stock actual de todos los productos en el inventario
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Stock obtenido correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/StockItem'
 *       401:
 *         description: No autorizado - Token inválido o faltante
 *       500:
 *         description: Error interno del servidor
 */

export default Router();


import pool from '../../../shared/database/postgres';

export class InventoryRepository {

    // Crear un movimiento de inventario
    async createMovement(
        productId: string,
        type: 'IN' | 'OUT',
        quantity: number,
        reason?: string
    ){
        const { rows } = await pool.query(
            `INSERT INTO inventory_movements (product_id, movement_type, quantity, reason)
            VALUES ($1, $2, $3, $4) RETURNING *`,
            [productId, type, quantity, reason]
        );
        return rows[0];
    }

    // Obtener el stock actual de un producto
    async getStockByProduct(productId: string): Promise<number> {
        const { rows } = await pool.query(
            `SELECT COALESCE(SUM(
                CASE
                    WHEN im.movement_type = 'IN' THEN im.quantity
                    ELSE -im.quantity
                END
            ), 0) AS stock
            FROM inventory_movements im
            INNER JOIN products p ON im.product_id = p.id
            WHERE im.product_id = $1 AND p.deleted_at IS NULL`
            ,
            [productId]
        );
        return Number(rows[0].stock);
    }

    // Obtener el stock de todos los productos
    async getAllStock(){
        const { rows } = await pool.query(
            `SELECT ps.* 
             FROM product_stock ps
             INNER JOIN products p ON ps.product_id = p.id
             WHERE p.deleted_at IS NULL
             ORDER BY ps.product_name`
        );
        return rows;
    }
}
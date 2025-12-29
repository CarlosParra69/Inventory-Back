import '../../../shared/database/postgres';
import pool from '../../../shared/database/postgres';

export interface Product {
    id: string;
    name: string;
    description: string | null;
    sku: string;
    category_id: string;
    created_at: Date;
}

export class ProductRepository {

    async findAll(): Promise<Product[]> {
        const { rows } = await pool.query(
            `SELECT id, name, description, sku, category_id, created_at 
             FROM products 
             WHERE deleted_at IS NULL 
             ORDER BY created_at DESC`
        );
        return rows;
    }

    async findById(id: string): Promise<Product | null> {
        const { rows } = await pool.query(
            `SELECT id, name, description, sku, category_id, created_at 
             FROM products 
             WHERE id = $1 AND deleted_at IS NULL`,
            [id]
        );
        return rows[0] || null;
    }

    async create(data: Omit<Product, 'id' | 'created_at'>): Promise<Product> {
        const { rows } = await pool.query(
            `INSERT INTO products (name, description, sku, category_id)
             VALUES ($1, $2, $3, $4)
             RETURNING *`,
            [data.name, data.description, data.sku, data.category_id]
        );
        return rows[0];
    }

    async update(id: string, data: Partial<Product>): Promise<Product | null> {
    const { rows } = await pool.query(
        `UPDATE products 
         SET name = $1, description = $2, sku = $3, category_id = $4
         WHERE id = $5 AND deleted_at IS NULL 
         RETURNING *`,
        [data.name, data.description, data.sku, data.category_id, id]
    );
    return rows[0] || null;
    }

    // Soft delete: marca un producto como eliminado
    async softDelete(id: string): Promise<void> {
        await pool.query(
            `UPDATE products 
             SET deleted_at = NOW() 
             WHERE id = $1 AND deleted_at IS NULL`,
            [id]
        );
    }

    // Restaura un producto eliminado
    async restore(id: string): Promise<void> {
        await pool.query(
            `UPDATE products 
             SET deleted_at = NULL 
             WHERE id = $1`,
            [id]
        );
    }
}
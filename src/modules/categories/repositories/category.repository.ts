import pool from '../../../shared/database/postgres';

export interface Category {
    id: string;
    name: string;
    description: string | null;
    created_at: Date;
}

export class CategoryRepository{
    // Busca todas las categorias
    async findAll(): Promise<Category[]> {
        const { rows } = await pool.query(
            `SELECT id, name, description, created_at 
             FROM categories 
             WHERE deleted_at IS NULL 
             ORDER BY name ASC`
        );
        return rows;
    }
    // Busca una categoria por su ID
    async findById(id: string): Promise<Category | null>{
        const { rows } = await pool.query(
            `SELECT id, name, description, created_at 
             FROM categories 
             WHERE id = $1 AND deleted_at IS NULL`,
            [id]
        );
        return rows[0] || null;
    }
    // Crea una nueva categoria
    async create(data: Omit<Category, 'id' | 'created_at'>): Promise<Category> {
        const { rows } = await pool.query(
            `INSERT INTO categories (name, description) VALUES ($1, $2) RETURNING *`,
            [data.name, data.description]
        );
        return rows[0];
    }
    // Actualiza una categoria existente
    async update(id: string, data: Partial<Category>): Promise<Category | null> {
        const { rows } = await pool.query(
            `UPDATE categories 
             SET name = $1, description = $2 
             WHERE id = $3 AND deleted_at IS NULL 
             RETURNING *`,
            [data.name, data.description, id]
        );
        return rows[0] || null;
    }
    // Soft delete: marca una categoria como eliminada
    async softDelete(id: string): Promise<void> {
        await pool.query(
            `UPDATE categories 
             SET deleted_at = NOW() 
             WHERE id = $1 AND deleted_at IS NULL`,
            [id]
        );
    }
    // Restaura una categoria eliminada
    async restore(id: string): Promise<void> {
        await pool.query(
            `UPDATE categories 
             SET deleted_at = NULL 
             WHERE id = $1`,
            [id]
        );
    }
}
import pool from '../../../shared/database/postgres';
import { User } from '../interfaces/user.interface';

export class AuthRepository {

    // Buscar usuario por email
    async findByEmail(email: string) {
        const { rows } = await pool.query(
            `SELECT id, name, email, password_hash, role
             FROM users
             WHERE email = $1`,
            [email]
        );

        return rows[0] || null;
    }

    // Buscar usuario por ID
    async findUserById(userId: string): Promise<User | null> {
        const { rows } = await pool.query(
            `SELECT id, name, email, role
             FROM users
             WHERE id = $1`,
            [userId]
        );

        return rows[0] || null;
    }

    // Crear usuario
    async createUser(
        name: string,
        email: string,
        passwordHash: string
    ) {
        const { rows } = await pool.query(
            `INSERT INTO users (name, email, password_hash)
             VALUES ($1, $2, $3)
             RETURNING id, name, email, role, created_at`,
            [name, email, passwordHash]
        );

        return rows[0];
    }

    // Guardar refresh token
    async saveRefreshToken(
        userId: string,
        token: string,
        expiresAt: Date
    ) {
        await pool.query(
            `INSERT INTO refresh_tokens (user_id, token, expires_at)
             VALUES ($1, $2, $3)`,
            [userId, token, expiresAt]
        );
    }

    // Buscar refresh token
    async findRefreshToken(token: string) {
        const { rows } = await pool.query(
            `SELECT token, user_id, expires_at
             FROM refresh_tokens
             WHERE token = $1`,
            [token]
        );

        return rows[0] || null;
    }

    // Rotacion del Refresh Token
    async rotateRefreshToken(
        oldToken: string,
        userId: string,
        newToken: string,
        expiresAt: Date
    ){
        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            await client.query('DELETE FROM refresh_tokens WHERE token = $1',
                [oldToken]
            );

            await client.query(
                `INSERT INTO refresh_tokens (user_id, token, expires_at)
                 VALUES ($1, $2, $3)`,
                [userId, newToken, expiresAt]
            );

            await client.query('COMMIT');

        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        }finally{
            client.release();
        }
    }

    // Eliminar refresh token
    async deleteRefreshToken(token: string) {
        await pool.query(
            `DELETE FROM refresh_tokens
             WHERE token = $1`,
            [token]
        );
    }
}

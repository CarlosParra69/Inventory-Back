import pool from '../../../shared/database/postgres';

export interface AuditLog {
    id: string;
    user_id: string;
    role: string;
    action: string;
    resource: string;
    resource_id: string;
    ip: string;
    created_at: Date;
}

export interface DecodedAuditLog extends AuditLog {
    userName?: string;
    resourceName?: string;
}

export interface PaginatedAudits {
    data: DecodedAuditLog[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

export class AuditRepository {
    
    private readonly LIMIT = 15;

    // Busca todas las auditorías con paginación
    async findAll(page: number): Promise<PaginatedAudits> {
        const offset = (page - 1) * this.LIMIT;
        
        const { rows: audits } = await pool.query(
            `SELECT id, user_id, role, action, resource, resource_id, ip, created_at 
             FROM audit_logs 
             ORDER BY created_at DESC 
             LIMIT $1 OFFSET $2`,
            [this.LIMIT, offset]
        );

        const { rows: countResult } = await pool.query(
            `SELECT COUNT(*) as count FROM audit_logs`
        );
        
        const total = parseInt(countResult[0].count);

        // Decodificar auditorías
        const decodedAudits = await this.decodeAudits(audits);

        return {
            data: decodedAudits,
            pagination: {
                page,
                limit: this.LIMIT,
                total,
                totalPages: Math.ceil(total / this.LIMIT)
            }
        };
    }

    // Busca auditorías por usuario_id
    async findByUserId(userId: string, page: number): Promise<PaginatedAudits> {
        const offset = (page - 1) * this.LIMIT;

        const { rows: audits } = await pool.query(
            `SELECT id, user_id, role, action, resource, resource_id, ip, created_at 
             FROM audit_logs 
             WHERE user_id = $1
             ORDER BY created_at DESC 
             LIMIT $2 OFFSET $3`,
            [userId, this.LIMIT, offset]
        );

        const { rows: countResult } = await pool.query(
            `SELECT COUNT(*) as count FROM audit_logs WHERE user_id = $1`,
            [userId]
        );

        const total = parseInt(countResult[0].count);

        // Decodificar auditorías
        const decodedAudits = await this.decodeAudits(audits);

        return {
            data: decodedAudits,
            pagination: {
                page,
                limit: this.LIMIT,
                total,
                totalPages: Math.ceil(total / this.LIMIT)
            }
        };
    }

    // Busca auditorías por resource_id
    async findByResourceId(resourceId: string, page: number): Promise<PaginatedAudits> {
        const offset = (page - 1) * this.LIMIT;

        const { rows: audits } = await pool.query(
            `SELECT id, user_id, role, action, resource, resource_id, ip, created_at 
             FROM audit_logs 
             WHERE resource_id = $1
             ORDER BY created_at DESC 
             LIMIT $2 OFFSET $3`,
            [resourceId, this.LIMIT, offset]
        );

        const { rows: countResult } = await pool.query(
            `SELECT COUNT(*) as count FROM audit_logs WHERE resource_id = $1`,
            [resourceId]
        );

        const total = parseInt(countResult[0].count);

        // Decodificar auditorías
        const decodedAudits = await this.decodeAudits(audits);

        return {
            data: decodedAudits,
            pagination: {
                page,
                limit: this.LIMIT,
                total,
                totalPages: Math.ceil(total / this.LIMIT)
            }
        };
    }

    // Método privado para decodificar user_id y resource_id
    private async decodeAudits(audits: AuditLog[]): Promise<DecodedAuditLog[]> {
        return Promise.all(
            audits.map(async (audit) => {
                let userName: string | undefined;
                let resourceName: string | undefined;

                // Obtener nombre del usuario
                try {
                    const userResult = await pool.query(
                        `SELECT name FROM users WHERE id = $1`,
                        [audit.user_id]
                    );
                    userName = userResult.rows[0]?.name;
                } catch (error) {
                    console.error(`Error fetching user name: ${error}`);
                }

                // Obtener nombre del recurso según su tipo
                if (audit.resource_id && audit.resource) {
                    try {
                        let query = '';
                        let params = [audit.resource_id];

                        switch (audit.resource) {
                            case 'CATEGORY':
                                query = `SELECT name FROM categories WHERE id = $1`;
                                break;
                            case 'PRODUCT':
                                query = `SELECT name FROM products WHERE id = $1`;
                                break;
                            case 'USER':
                                query = `SELECT name FROM users WHERE id = $1`;
                                break;
                        }

                        if (query) {
                            const resourceResult = await pool.query(query, params);
                            resourceName = resourceResult.rows[0]?.name;
                        }
                    } catch (error) {
                        console.error(`Error fetching resource name: ${error}`);
                    }
                }

                return {
                    ...audit,
                    userName,
                    resourceName
                };
            })
        );
    }
}

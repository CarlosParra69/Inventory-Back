import { Request, Response, NextFunction } from 'express';
import pool from '../database/postgres';

export function audit(action: string, resource: string) {
    return async (req: Request, res: Response, next: NextFunction) => {
        res.on('finish', async () => {
            if (!req.user?.id) return;

            const resourceId =
                res.locals.audit?.resourceId ??
                req.params.id ??
                null;

            const ip =
                req.headers['x-forwarded-for']?.toString().split(',')[0] ??
                req.socket.remoteAddress;

            try {
                await pool.query(
                    `INSERT INTO audit_logs
                    (user_id, role, action, resource, resource_id, ip)
                    VALUES ($1, $2, $3, $4, $5, $6)`,
                    [
                        req.user.id,
                        req.user.role ?? null,
                        action,
                        resource,
                        resourceId,
                        ip
                    ]
                );
            } catch (error) {
                console.error('Error en Auditoría:', error);
            }
        });

        next();
    };
}

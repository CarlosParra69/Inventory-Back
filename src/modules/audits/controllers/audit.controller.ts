import { Request, Response } from 'express';
import { AuditService } from '../services/audit.service';

const service = new AuditService();

export class AuditController {
    
    // Obtener todas las auditorías con paginación
    async getAll(req: Request, res: Response) {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const result = await service.getAll(page);
            res.json(result);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    // Obtener auditorías por usuario
    async getByUserId(req: Request, res: Response) {
        try {
            const userId = req.params.userId;
            const page = parseInt(req.query.page as string) || 1;
            const result = await service.getByUserId(userId, page);
            res.json(result);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    // Obtener auditorías por recurso
    async getByResourceId(req: Request, res: Response) {
        try {
            const resourceId = req.params.resourceId;
            const page = parseInt(req.query.page as string) || 1;
            const result = await service.getByResourceId(resourceId, page);
            res.json(result);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }
}

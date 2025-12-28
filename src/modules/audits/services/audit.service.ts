import { AuditRepository, PaginatedAudits } from '../repositories/audit.repository';

export class AuditService {

    private repository = new AuditRepository();

    // Obtiene todas las auditorías con paginación
    async getAll(page: number): Promise<PaginatedAudits> {
        if (page < 1) {
            throw new Error('El número de página debe ser mayor a 0');
        }
        return this.repository.findAll(page);
    }

    // Obtiene auditorías por usuario
    async getByUserId(userId: string, page: number): Promise<PaginatedAudits> {
        if (!userId) {
            throw new Error('El ID del usuario es requerido');
        }
        if (page < 1) {
            throw new Error('El número de página debe ser mayor a 0');
        }
        return this.repository.findByUserId(userId, page);
    }

    // Obtiene auditorías por recurso
    async getByResourceId(resourceId: string, page: number): Promise<PaginatedAudits> {
        if (!resourceId) {
            throw new Error('El ID del recurso es requerido');
        }
        if (page < 1) {
            throw new Error('El número de página debe ser mayor a 0');
        }
        return this.repository.findByResourceId(resourceId, page);
    }
}

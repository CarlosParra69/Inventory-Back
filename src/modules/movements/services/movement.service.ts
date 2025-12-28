import { MovementRepository, PaginatedMovements } from '../repositories/movement.repository';

export class MovementService {

  private repository = new MovementRepository();

  // Obtiene todos los movimientos con paginación
  async getAll(page: number): Promise<PaginatedMovements> {
    if (page < 1) {
      throw new Error('El número de página debe ser mayor a 0');
    }
    return this.repository.findAll(page);
  }

  // Obtiene movimientos por producto
  async getByProductId(productId: string, page: number): Promise<PaginatedMovements> {
    if (!productId) {
      throw new Error('El ID del producto es requerido');
    }
    if (page < 1) {
      throw new Error('El número de página debe ser mayor a 0');
    }
    return this.repository.findByProductId(productId, page);
  }

  // Obtiene movimientos de entrada (IN)
  async getEntries(page: number): Promise<PaginatedMovements> {
    if (page < 1) {
      throw new Error('El número de página debe ser mayor a 0');
    }
    return this.repository.findEntries(page);
  }

  // Obtiene movimientos de salida (OUT)
  async getExits(page: number): Promise<PaginatedMovements> {
    if (page < 1) {
      throw new Error('El número de página debe ser mayor a 0');
    }
    return this.repository.findExits(page);
  }
}

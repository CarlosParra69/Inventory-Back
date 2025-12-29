import pool from '../../../shared/database/postgres';

export interface InventoryMovement {
  id: string;
  product_id: string;
  movement_type: 'IN' | 'OUT';
  quantity: number;
  reason: string;
  created_at: Date;
}

export interface DecodedMovement extends InventoryMovement {
  productName?: string;
}

export interface PaginatedMovements {
  data: DecodedMovement[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export class MovementRepository {
  
  private readonly LIMIT = 6;

  // Obtiene todos los movimientos con paginación
  async findAll(page: number): Promise<PaginatedMovements> {
    const offset = (page - 1) * this.LIMIT;
    
    const { rows: movements } = await pool.query(
      `SELECT id, product_id, TRIM(movement_type) as movement_type, quantity, reason, created_at 
       FROM inventory_movements 
       ORDER BY created_at DESC 
       LIMIT $1 OFFSET $2`,
      [this.LIMIT, offset]
    );

    const { rows: countResult } = await pool.query(
      `SELECT COUNT(*) as count FROM inventory_movements`
    );
    
    const total = parseInt(countResult[0].count);

    // Decodificar movimientos
    const decodedMovements = await this.decodeMovements(movements);

    return {
      data: decodedMovements,
      pagination: {
        page,
        limit: this.LIMIT,
        total,
        totalPages: Math.ceil(total / this.LIMIT)
      }
    };
  }

  // Obtiene movimientos por producto
  async findByProductId(productId: string, page: number): Promise<PaginatedMovements> {
    const offset = (page - 1) * this.LIMIT;

    const { rows: movements } = await pool.query(
      `SELECT id, product_id, TRIM(movement_type) as movement_type, quantity, reason, created_at 
       FROM inventory_movements 
       WHERE product_id = $1
       ORDER BY created_at DESC 
       LIMIT $2 OFFSET $3`,
      [productId, this.LIMIT, offset]
    );

    const { rows: countResult } = await pool.query(
      `SELECT COUNT(*) as count FROM inventory_movements WHERE product_id = $1`,
      [productId]
    );

    const total = parseInt(countResult[0].count);

    // Decodificar movimientos
    const decodedMovements = await this.decodeMovements(movements);

    return {
      data: decodedMovements,
      pagination: {
        page,
        limit: this.LIMIT,
        total,
        totalPages: Math.ceil(total / this.LIMIT)
      }
    };
  }

  // Obtiene movimientos de entrada (IN)
  async findEntries(page: number): Promise<PaginatedMovements> {
    const offset = (page - 1) * this.LIMIT;

    const { rows: movements } = await pool.query(
      `SELECT id, product_id, TRIM(movement_type) as movement_type, quantity, reason, created_at 
       FROM inventory_movements 
       WHERE TRIM(movement_type) = 'IN'
       ORDER BY created_at DESC 
       LIMIT $1 OFFSET $2`,
      [this.LIMIT, offset]
    );

    const { rows: countResult } = await pool.query(
      `SELECT COUNT(*) as count FROM inventory_movements WHERE TRIM(movement_type) = 'IN'`
    );

    const total = parseInt(countResult[0].count);

    // Decodificar movimientos
    const decodedMovements = await this.decodeMovements(movements);

    return {
      data: decodedMovements,
      pagination: {
        page,
        limit: this.LIMIT,
        total,
        totalPages: Math.ceil(total / this.LIMIT)
      }
    };
  }

  // Obtiene movimientos de salida (OUT)
  async findExits(page: number): Promise<PaginatedMovements> {
    const offset = (page - 1) * this.LIMIT;

    const { rows: movements } = await pool.query(
      `SELECT id, product_id, TRIM(movement_type) as movement_type, quantity, reason, created_at 
       FROM inventory_movements 
       WHERE TRIM(movement_type) = 'OUT'
       ORDER BY created_at DESC 
       LIMIT $1 OFFSET $2`,
      [this.LIMIT, offset]
    );

    const { rows: countResult } = await pool.query(
      `SELECT COUNT(*) as count FROM inventory_movements WHERE TRIM(movement_type) = 'OUT'`
    );

    const total = parseInt(countResult[0].count);

    // Decodificar movimientos
    const decodedMovements = await this.decodeMovements(movements);

    return {
      data: decodedMovements,
      pagination: {
        page,
        limit: this.LIMIT,
        total,
        totalPages: Math.ceil(total / this.LIMIT)
      }
    };
  }

  // Método privado para decodificar product_id
  private async decodeMovements(movements: InventoryMovement[]): Promise<DecodedMovement[]> {
    return Promise.all(
      movements.map(async (movement) => {
        let productName: string | undefined;

        // Obtener nombre del producto
        if (movement.product_id) {
          try {
            const productResult = await pool.query(
              `SELECT name FROM products WHERE id = $1`,
              [movement.product_id]
            );
            productName = productResult.rows[0]?.name;
          } catch (error) {
            console.error(`Error fetching product name: ${error}`);
          }
        }

        // Normalizar movement_type eliminando espacios en blanco
        const normalizedMovementType = (movement.movement_type?.trim() || movement.movement_type) as 'IN' | 'OUT';

        return {
          ...movement,
          movement_type: normalizedMovementType,
          productName
        };
      })
    );
  }
}

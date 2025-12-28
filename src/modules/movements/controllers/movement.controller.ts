import { Request, Response } from 'express';
import { MovementService } from '../services/movement.service';

const service = new MovementService();

export class MovementController {
    
  // Obtener todos los movimientos con paginación
  async getAll(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const result = await service.getAll(page);
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  // Obtener movimientos por producto
  async getByProductId(req: Request, res: Response) {
    try {
      const productId = req.params.productId;
      const page = parseInt(req.query.page as string) || 1;
      const result = await service.getByProductId(productId, page);
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  // Obtener movimientos de entrada (IN)
  async getEntries(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const result = await service.getEntries(page);
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  // Obtener movimientos de salida (OUT)
  async getExits(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const result = await service.getExits(page);
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
}

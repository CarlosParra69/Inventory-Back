import { Request, Response } from 'express';
import { InventoryService } from '../services/inventory.service';

const service = new InventoryService();

export class InventoryController{

    // Registrar entrada de inventario
    async entry(req: Request, res: Response){
        try{
            const { productId, quantity, reason } = req.body;
            const movement = await service.registerEntry(productId, quantity, reason);
            res.status(201).json(movement);
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }

    // Registrar salida de inventario
    async exit (req: Request, res: Response){
        try {
            const { productId, quantity, reason } = req.body;
            const movement = await service.registerExit(productId, quantity, reason);
            res.status(201).json(movement);
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }

    // Obtener stock actual
    async stock(req: Request, res: Response){
        const stock = await service.getStock();
        res.json(stock);
    }
}
import { Request, Response } from "express";
import { ProductService } from "../services/product.service";

const service = new ProductService();

export class ProductController {

    // Listar todos los productos
    async getAll(req: Request, res: Response) {
        const products = await service.getAll();
        res.json(products);
    }

    // Obtener un producto por ID
    async getById(req: Request, res: Response) {
        try {
            const product = await service.getById(req.params.id);
            res.json(product);
        } catch (error: any) {
            res.status(404).json({ message: error.message });
        }
    }

    // Crear un nuevo producto
    async create(req: Request, res: Response) {
        const product = await service.create(req.body);
        res.status(201).json(product);
    }

    // Actualizar un producto existentes
    async update(req: Request, res: Response) {
        try{
            const product = await service.update(req.params.id, req.body);
            res.json(product);
        }catch (error: any) {
            res.status(404).json({ message: error.message });
        }
    }
    
    // Eliminar un producto por ID (soft delete)
    async delete(req: Request, res: Response) {
        await service.delete(req.params.id);
        res.status(204).send();
    }

    // Restaurar un producto eliminado
    async restore(req: Request, res: Response) {
        await service.restore(req.params.id);
        res.status(200).json({ message: 'Producto restaurado exitosamente' });
    }
}
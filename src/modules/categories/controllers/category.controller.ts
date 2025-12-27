import { Request, Response  } from "express";
import { CategoryService } from "../services/category.service";

const service = new CategoryService();

export class CategoryController {

    // Crear una nueva categoría
    async getAll(req: Request, res: Response) {
        const categories = await service.getAll();
        res.json(categories);
    }

    // Obtener una categoría por ID
    async getById(req: Request, res: Response) {
        try {
            const category = await service.getById(req.params.id);
            res.json(category);
        } catch (error: any) {
            res.status(404).json({ message: error.message });
        }
    }

    // Crear una nueva categoría
    async create(req: Request, res: Response) {
        const category = await service.create(req.body);
        res.locals.audit = {
            resourceId: category.id
        }
        res.status(201).json(category);
    }

    // Actualizar una categoría existente
    async update(req: Request, res: Response) {
        try {
            const category = await service.update(req.params.id, req.body);
            res.json(category);
        } catch (error: any) {
            res.status(404).json({ message: error.message });
        }        
    }

    // Eliminar una categoría por ID (soft delete)
    async delete (req: Request, res: Response) {
        await service.delete(req.params.id);
        res.status(204).send();
    }

    // Restaurar una categoría eliminada
    async restore(req: Request, res: Response) {
        await service.restore(req.params.id);
        res.status(200).json({ message: 'Categoría restaurada exitosamente' });
    }
}
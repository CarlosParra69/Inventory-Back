import { CategoryRepository } from '../repositories/category.repository';

export class CategoryService {

    private repository = new CategoryRepository();

    // Obtiene todas las categorias
    async getAll(){
        return this.repository.findAll();
    }

    // Obtiene una categoria por su ID
    async getById(id: string){
        const category = await this.repository.findById(id);
        if(!category){
            throw new Error('Categoria no encontrada');
        }
        return category;
    }
    
    // Crea una nueva categoria
    async create(data: any){
        return this.repository.create(data);
    }

    // Actualiza una categoria existente
    async update(id: string, data: any){
        const category = await this.repository.update(id, data);
        if(!category){
            throw new Error('Categoria no encontrada para actualizar');
        }
    }

    // Elimina una categoria por su ID (soft delete)
    async delete(id: string){
        await this.repository.softDelete(id);
    }
    // Restaura una categoria eliminada
    async restore(id: string){
        await this.repository.restore(id);
    }
}
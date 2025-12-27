import { ProductRepository } from "../repositories/product.repository";

export class ProductService {
    private repository = new ProductRepository();

    // Obtener todos los productos
    async getAll(){
        return this.repository.findAll();
    }

    // Obtener un producto por su ID
    async getById(id: string){
        const product = await this.repository.findById(id);
        if (!product){
            throw new Error('Producto no encontrado');
        }
        return product;
    }

    // Crear un nuevo producto
    async create(data: any){
        return this.repository.create(data);        
    }

    // Actualizar un producto por su ID
    async update(id: string, data: any){
        const product = await this.repository.update(id, data);
        if (!product){
            throw new Error('Producto no encontrado para actualizar');
        }
        return product;
    }
    // Eliminar un producto por su ID (soft delete)
    async delete(id: string){
        await this.repository.softDelete(id);
    }

    // Restaurar un producto eliminado
    async restore(id: string){
        await this.repository.restore(id);
    }

}
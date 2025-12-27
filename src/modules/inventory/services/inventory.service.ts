import { InventoryRepository } from "../repositories/inventory.repository";

export class InventoryService {
    private repository = new InventoryRepository();

    // Registra una entrada de inventario
    async registerEntry(
        productId: string,
        quantity: number,
        reason?: string
    ){
        if (quantity <= 0) {
            throw new Error("La cantidad debe ser mayor que cero para una entrada.");
        }

        return this.repository.createMovement(productId, 'IN', quantity, reason);
    }

    // Registra una salida de inventario
    async registerExit(
        productId: string,
        quantity: number,
        reason?: string
    ){
        if (quantity <= 0) {
            throw new Error("La cantidad debe ser mayor que cero para una salida.");
        }

        const currentStock = await this.repository.getStockByProduct(productId);

        if (currentStock < quantity) {
            throw new Error("No hay suficiente stock para realizar la salida.");
        }

        return this.repository.createMovement(productId, 'OUT', quantity, reason);

    }

    // Obtiene el stock actual de todos los productos
    async getStock(){
        return this.repository.getAllStock();
    }
}
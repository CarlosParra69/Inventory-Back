import dotenv from 'dotenv';
import app from './app';
import pool from './shared/database/postgres';

dotenv.config();

const PORT = process.env.PORT || 3000;

// Iniciar el servidor
async function startServer() {
    try {
        // Verificar la conexión a PostgreSQL antes de iniciar el servidor
        await pool.query('SELECT 1');
        console.log('Conexión a la base de datos exitosa');

        app.listen(PORT, () => {
            console.log(`Servidor escuchando en el puerto ${PORT}`);
        });
    }catch{
        console.error('No se pudo conectar a la base de datos. El servidor no se iniciará.');
        process.exit(1);
    }
}

startServer();
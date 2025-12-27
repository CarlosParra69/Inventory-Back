import pool from './postgres';

async function testConnection() {
    const result = await pool.query('SELECT NOW()');
    console.log('Hora del servidor:', result.rows[0]);
    process.exit(0);
}

testConnection();
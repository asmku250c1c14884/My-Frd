const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.static(__dirname)); // This serves your HTML files automatically
app.use(express.json());

// Redirect root to index.html
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// PostgreSQL Connection String
// Replace with your actual credentials: 'postgresql://postgres:sanjeev@localhost:5432/portfolio_auth'
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'portfolio_auth', // Updated to match your portfolio_auth database
    password: 'sanjeev', // Change this to your pgAdmin password
    port: 5432,
});

// Initialize database table
const initDb = async () => {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS friends_names (
                id SERIAL PRIMARY KEY,
                name TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log('Database table initialized successfully.');
    } catch (err) {
        console.error('Error initializing database:', err.message);
    }
};

initDb();

// API Endpoint to save name
app.post('/api/save-name', async (req, res) => {
    const { name } = req.body;
    if (!name) {
        return res.status(400).json({ error: 'Name is required' });
    }

    try {
        await pool.query('INSERT INTO friends_names (name) VALUES ($1)', [name]);
        res.status(200).json({ message: 'Saved' }); // Only send "Saved" as per request
    } catch (err) {
        console.error('Error saving name:', err.message);
        res.status(500).json({ error: 'Failed to save name' });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

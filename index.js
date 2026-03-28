const express = require('express');
const cors = require('cors');
require('dotenv').config();

const path = require('path');
const app = express();
const PORT = process.env.PORT || 5000;

const RunMigrate = require('./src/config/migrate');
// Important route
const category = require('./src/routes/categoryRoute');
const brand = require('./src/routes/brandRouter')
const product = require('./src/routes/productRouter')
const user = require('./src/routes/userRoute')
// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (Required for Brand Photos)
app.use('/assets/upload', express.static(path.join(__dirname, 'assets/upload')));

// Routes
user(app)
product(app)
brand(app)
category(app);

// Simple health check route to verify the server is alive
app.get('/', (req, res) => {
    res.send('Backend Server is Running!');
});
// Startup Function
const start = async () => {
    try {
        console.log('Starting migration...');
        await RunMigrate();
        console.log('Migration finished.');

        const server = app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });

        server.on('error', (err) => {
            console.error('Server encountered an error:', err);
            process.exit(1);
        });

    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }

};

start();

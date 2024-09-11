const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000; // Port for your API
require('dotenv').config();

app.use(cors()); // Enable CORS for all origins

// Connect to MongoDB
const url = process.env.MONGO_URI;
const dbName = 'press_db';
let db;

const connectToMongo = async () => {
    try {
        const client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
        db = client.db(dbName);
        console.log('Connected to MongoDB');
    } catch (err) {
        console.error('Failed to connect to MongoDB', err);
        process.exit(1); // Exit process if connection fails
    }
};

// Call the connection function
connectToMongo();

// Define a route to get data
app.get('/data', async (req, res) => {
    if (!db) {
        return res.status(500).send('Database connection not established');
    }

    try {
        const collection = db.collection('press_data');
        const data = await collection.find({}).toArray();
        res.json(data);
    } catch (err) {
        console.error('Error fetching data', err);
        res.status(500).send('Error fetching data');
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
// my-app/server/routes/api.js
const express = require('express');
const router = express.Router();
const { MongoClient } = require('mongodb');

const uri = 'your_mongodb_connection_string';
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function connectToMongoDB() {
  try {
    await client.connect();
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB', error);
  }
}

connectToMongoDB();

// Sample endpoint to fetch data
router.get('/getData', async (req, res) => {
  const db = client.db('your_database_name');
  const collection = db.collection('your_collection_name');
  
  try {
    const data = await collection.find({}).toArray();
    res.json(data);
  } catch (error) {
    console.error('Error fetching data', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;

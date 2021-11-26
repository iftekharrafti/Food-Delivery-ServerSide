const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

const cors = require('cors');
require('dotenv').config()

const app = express()
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ts3db.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
    try {
      await client.connect();
      const database = client.db("foodDelivery");
      const foodCollection = database.collection("food");
      const orderCollection = database.collection("order");
      // create a document to insert

    // Get API
    app.get('/services', async(req, res) => {
        const cursor = foodCollection.find({})
        const services = await cursor.toArray();
        res.send(services);
    });
    app.get('/orders', async(req, res) => {
        const cursor = orderCollection.find({})
        const services = await cursor.toArray();
        res.send(services);
    });

    

      // POST API
      app.post('/services', async(req, res) => {
        const service = req.body;

        const result = await foodCollection.insertOne(service);
        res.json(result);
    })
      app.post('/orders', async(req, res) => {
        const service = req.body;

        const result = await orderCollection.insertOne(service);
        res.json(result);
    })

    // DELETE API
    app.delete('/orders/:id', async(req, res) => {
      const id = req.params.id;
      const query = {_id: ObjectId(id)};
            const result = await orderCollection.deleteOne(query);
            res.json(result);
    })
    

      

    } finally {
    //   await client.close();
    }
  }
  run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Please buy something')
})
  
  app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
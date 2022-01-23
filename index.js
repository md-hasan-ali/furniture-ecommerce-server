const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config()
const cors = require('cors');
const app = express();
const port = process.env.PORT || 4000;

// MiddleWare 
app.use(cors())
app.use(express.json());

// Connection The DataBase
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ayr4p.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// function create 
async function run() {
    try {
        await client.connect();
        const database = client.db('furnitures');
        const productCollection = database.collection('products');
        const reviewCollection = database.collection('reviews');
        const ordersCollection = database.collection('orders');

        // get products 
        app.get('/products', async (req, res) => {
            const result = await productCollection.find({}).toArray()
            res.send(result);
        })
        // get single Product 
        app.get('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await productCollection.find(query).toArray();
            res.send(result);
        })
        // Add New product 
        app.post('/addNewProduct', async (req, res) => {
            const query = req.body;
            const result = await productCollection.insertOne(query);
            res.send(result);
        })
        // Delete Single product of productCollection
        app.delete('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await productCollection.deleteOne(query);
            res.send(result);
        })
        // Add Review 
        app.post('/addReview', async (req, res) => {
            const query = req.body;
            const result = await reviewCollection.insertOne(query);
            res.send(result);
        })
        // get Reviews 
        app.get('/reviews', async (req, res) => {
            const result = await reviewCollection.find({}).toArray();
            res.send(result);
        })
        // post new order 
        app.post('/orders', async (req, res) => {
            const query = req.body;
            const result = await ordersCollection.insertOne(query);
            res.send(result);
        })
        // get all orders
        app.get('/orders', async (req, res) => {
            const result = await ordersCollection.find({}).toArray();
            res.send(result);
        })
        // get single order
        app.delete('/singleOrder/:id', async (req, res) => {
            const id = req.params;
            const query = { _id: ObjectId(id) }
            const result = await ordersCollection.deleteOne(query);
            res.send(result);
        })
        // get myorders 
        app.get('/myOrders/:email', async (req, res) => {
            const email = req.params.email;
            const result = await ordersCollection.find({ email }).toArray();
            res.send(result)
        })
        // delete single order from my orders
        app.delete
    }
    finally {
        // await client.close()
    }
}
run().catch(console.dir);


app.listen(port, () => {
    console.log('listening the port is', port);
})
app.get('/', (req, res) => {
    res.json('furniture chair is runnig ..')
})


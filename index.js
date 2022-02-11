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
        const usersCollection = database.collection('users');

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
            console.log(id)
            const query = { _id: ObjectId(id) }
            console.log(query)
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

        // delete single order from manageAllOrder 
        app.delete('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: (id) }
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
        app.delete('/myOrders/:email/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: (id) }
            const result = await ordersCollection.deleteOne(query);
            res.send(result)
        })
        // User Created of website for authentication
        app.post('/users', async (req, res) => {
            const query = req.body;
            const result = await usersCollection.insertOne(query);
            res.send(result);
        })
        // update user of users 
        app.put('/users', async (req, res) => {
            const user = req.body;
            const filter = { email: user.email }
            const options = { upsert: true };
            const updateDoc = { $set: user };
            const result = await usersCollection.updateOne(filter, updateDoc, options);
            res.send(result);
        })
        // make admin user 
        app.put('/users/admin', async (req, res) => {
            const user = req.body;
            console.log(user)
            const filter = { email: user.email }
            const updateDoc = { $set: { role: 'admin' } }
            const result = await usersCollection.updateOne(filter, updateDoc);
            res.send(result);
        })
        // get admin email 
        app.get('/users/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email }
            const user = await usersCollection.findOne(query);
            let isAdmin = false;
            if (user?.role === 'admin') {
                isAdmin = true;
            }
            res.send({ admin: isAdmin });
        })
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


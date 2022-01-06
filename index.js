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

        // get products 
        app.get('/products', async (req, res) => {
            const result = await productCollection.find({}).toArray()
            res.send(result);
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


const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();


const port = process.env.PORT || 5000;
const app = express();

// middleware
app.use(cors());
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.kjb9ctc.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });




async function run() {
    try {
        const CategoriesCollection = client.db('assignment12').collection('productCategories')
        const allProductCollection = client.db('assignment12').collection('allProducts')

        // home categories setup  
        app.get('/categories', async (req, res) => {
            const query = {};
            const result = await CategoriesCollection.find(query).toArray();
            res.send(result)
        });


        // all category setup
        app.get('/categories/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const category = await CategoriesCollection.findOne(filter);
            const query = { category: category.name };
            const result = await allProductCollection.find(query).toArray();
            res.send(result);
        })

    }
    finally {

    }
}
run().catch(console.log)










app.get('/', async (req, res) => {
    res.send('Assignment 12 server is Running')
})

app.listen(port, () => console.log(`assignment 12 running on ${port}`))
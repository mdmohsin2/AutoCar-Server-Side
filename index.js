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
        const bookingsCollection = client.db('assignment12').collection('bookingProducts')
        const usersCollection = client.db('assignment12').collection('users')

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
        });

        // modal booking api get setup my orders page
        app.get('/bookings', async (req, res) => {
            const email = req.query.email;
            const query = { email: email };
            const cursor = await bookingsCollection.find(query).toArray();
            res.send(cursor);
        })

        // modal booking api setup
        app.post('/bookings', async (req, res) => {
            const booking = req.body;
            // const query = {}
            const result = await bookingsCollection.insertOne(booking);
            res.send(result)
        });

        // all users set
        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user);
            res.send(result)
        });

        // my product api setup 
        app.get('/products', async (req, res) => {
            const email = req.query.email;
            const query = { email: email };
            const cursor = await allProductCollection.find(query).toArray();
            res.send(cursor);
        })

        // add Product api setup
        app.post('/products', async (req, res) => {
            const ProductAdd = req.body;
            const result = await allProductCollection.insertOne(ProductAdd);
            res.send(result)
        });

        app.delete('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await allProductCollection.deleteOne(query);
            res.send(result)
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
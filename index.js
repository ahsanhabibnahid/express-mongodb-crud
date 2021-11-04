const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const ObjectId = require('mongodb').ObjectId

const app = express()
const MongoClient = require('mongodb').MongoClient;

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cors())

const uri = "mongodb+srv://dbUser:y3lMikX1dQUftjw8@cluster0.e2ypf.mongodb.net/organicdb?retryWrites=true&w=majority";

const password = 'y3lMikX1dQUftjw8'

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect(err => {
    const collection = client.db("organicdb").collection("products");
    
    //get data
    app.get('/products', (req, res) => {
        collection.find({})
        .toArray((err, documents) => {
            res.send(documents)
        })
    })

    //get single product
    app.get('/product/:id', (req, res) => {
        collection.find({_id: ObjectId(req.params.id)})
        .toArray((err, documents) => {
            res.send(documents[0])
        })
    })

    //post data
    app.post('/addProduct', (req, res) => {
        const product = req.body
        collection.insertOne(product)
        .then(result => {
            console.log('data insert successfully')
            res.send('data insert successfully')
        })
    })

    // delete data
    app.delete('/delete/:id', (req, res) => {
        collection.deleteOne({_id: ObjectId(req.params.id)})
        .then( result => {
            console.log(result)
        })
    })

    console.log('database connected')
   
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
})

app.listen(4000)
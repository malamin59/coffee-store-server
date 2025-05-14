require('dotenv').config();
const express = require("express");
const cors = require('cors')
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('coffee server id getting hotter')
})

const uri = `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@ac-iu13kdk-shard-00-00.syzuvzl.mongodb.net:27017,ac-iu13kdk-shard-00-01.syzuvzl.mongodb.net:27017,ac-iu13kdk-shard-00-02.syzuvzl.mongodb.net:27017/?ssl=true&replicaSet=atlas-133yf2-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0`;


MongoClient.connect(uri, function (err, client) {
  const collection = client.db("test").collection("devices");
  // perform actions on the collection object
  client.close();
});


const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
async function run() {
 try {

    await client.connect();
    const coffeeCollection = client.db('coffeeDB').collection('coffees')

    app.get('/coffees', async (req, res) => {
      //   const cursor = coffeeCollection.find();
      //  const result = await cursor.toArray();
      const result = await coffeeCollection.find().toArray();
      res.send(result)
    })

    app.get('/coffees/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await coffeeCollection.findOne(query);
      res.send(result)
    })

    app.post('/coffees', async (req, res) => {
      const newCoffee = req.body;
      console.log(newCoffee);
      const result = await coffeeCollection.insertOne(newCoffee)
      res.send(result)
    })

    app.put('/coffees/:id', async(req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) }
      const options = { upsert: true } 
      const updateCoffee = req.body
      const updateDoc = {
        $set: updateCoffee
      }
      const result = await coffeeCollection.updateOne(filter, updateDoc, options)
      res.send(result)
    })

    app.delete('/coffees/:id', async(req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await coffeeCollection.deleteOne(query);
      res.send(result)
    })

    // Connect the client to the server	(optional starting in v4.7)
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`coffee server id running on port ${port}`)
})
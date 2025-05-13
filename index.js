require('dotenv').config();
const express = require("express");
const cors = require('cors')
const app = express();
const { MongoClient, ServerApiVersion } = require('mongodb');

const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.get('/' , (req, res) =>{
    res.send('coffee server id getting hotter')
})

// console.log(process.env.DB_USER);
// console.log(process.env.DB_PASS)

const uri = `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@ac-iu13kdk-shard-00-00.syzuvzl.mongodb.net:27017,ac-iu13kdk-shard-00-01.syzuvzl.mongodb.net:27017,ac-iu13kdk-shard-00-02.syzuvzl.mongodb.net:27017/?ssl=true&replicaSet=atlas-133yf2-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0`;


MongoClient.connect(uri, function(err, client) {
  const collection = client.db("test").collection("devices");
  // perform actions on the collection object
  client.close();
});


// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port , () =>{
    console.log(`coffee server id running on port ${port}`)
})
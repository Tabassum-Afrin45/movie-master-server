const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion,ObjectId } = require('mongodb');
const app = express()
const port = 3000

app.use(cors())
app.use(express.json())
const uri = "mongodb+srv://movieMaster-DB:nc9wtUH5JeAGqwgs@cluster0.9hxu1jn.mongodb.net/?appName=Cluster0";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

app.get('/', (req, res) => {
  res.send('Movie Master Pro is Running')
})

async function run() {
  try {
    await client.connect();
    const db=client.db('movies_db')
    const movieCollection=db.collection('movies')
    
    app.get('/movies',async(req,res)=>{
        const email=req.query.email
        const query={}
        if(email){
            query.email=email
        }
        const cursor=movieCollection.find(query)
        const result=await cursor.toArray()
        res.send(result)
    })

    app.get('/movies/:id',async(req,res)=>{
        const id=req.params.id
        const query={_id: new ObjectId(id)}
        const result=await movieCollection.findOne(query)
        res.send(result)
    })

    app.post('/movies',async(req,res)=>{
        const newMovie=req.body;
        const result=await movieCollection.insertOne(newMovie)
        res.send(result);
    })
    
       app.patch('/movies/:id',async(req,res)=>{
        const id =req.params.id
        const updatedMovie=req.body
        const query={_id:new ObjectId(id)}
        const update={
            $set:{
                title: updatedMovie.title,
                genre:updatedMovie.genre,
                releaseYear:updatedMovie.releaseYear,
                cast:updatedMovie.cast,
                duration:updatedMovie.duration,
                postSummary:updatedMovie.postSummary,
                postUrl:updatedMovie.postUrl,
                country:updatedMovie.country
            }
        }
        const result =await movieCollection.updateOne(query,update)
        res.send(result)
    })

       app.delete('/movies/:id',async(req,res)=>{
        const id =req.params.id
        const query={_id:new ObjectId(id)}
        const result=await movieCollection.deleteOne(query)
        res.send(result)
    })

    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } 
  finally {

  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`Movie Master Pro Server is Listening ${port}`)
})

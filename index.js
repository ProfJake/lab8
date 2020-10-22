var mongoClient = require("mongodb").MongoClient;


var url = "mongodb://127.0.0.1:27017/"

    const client = new mongoClient(url);

async function run(){

    try{
	await client.connect({useUnifiedTopology: true});
	

       const actDB = client.db("practiceDB");
       const activities = actDB.collection("activities");

       const query = { distance: { $lt: 5 }};

       const cursor = activities.find(query, {
	       projection: { _id:0 , activity: 1, distance: 1}});

       if (( await cursor.count())== 0){
	   console.log("No docs found!");
       }

       await cursor.forEach(console.dir);
    } finally{
	await client.close();
    }

}

run().catch(console.dir);
var mongoClient = require("mongodb").MongoClient;
var tracker = require("tracker");

var url = "mongodb://127.0.0.1:27017/"

    const client = new mongoClient(url);

async function run(){

    try{
	await client.connect({useUnifiedTopology: true});
	

       const actDB = client.db("practiceDB");
       const activities = actDB.collection("activities");

       const query = { user: { $exists: true } };

       const cursor = activities.find(query, {
	       projection: { _id:0 , activity: 1, distance: 1, weight: 1, time: 1, user: 1}});

       if (( await cursor.count())== 0){
	   console.log("No docs found!");
       }
       
       await cursor.forEach(item =>{ 
	       let current = new tracker(item.activity.type, item.weight, item.distance, item.time);       
	       console.log(`${item.user} burned ${current.calculate()} calories by ${item.activity.type}! `);
	   });
    } finally{
	await client.close();
    }

}

run().catch(console.dir);
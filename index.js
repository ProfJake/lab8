var mongoClient = require("mongodb").MongoClient;
var tracker = require("tracker");

var url = "mongodb://127.0.0.1:27017/"

    const client = new mongoClient(url);

//turn this function into an async function so it returns a promise
async function run(){

    try{


	await client.connect({useUnifiedTopology: true});
	

       const actDB = client.db("practiceDB");
       const activities = actDB.collection("activities");
       //notice how the query is exactly the same as if it were in the Mongoshell
       const query = { user: { $exists: true } };

       const cursor = activities.find(query, {
	       projection: { _id:0 , activity: 1, distance: 1, weight: 1, time: 1, user: 1}});

       //Querying the mongodb in modern code returns a "cursor" object
       if (( await cursor.count())== 0){
	   console.log("No docs found!");
       }
       
       //cursors contain all of the results, and can be iterated over
       await cursor.forEach(item =>{ 
	       let current = new tracker(item.activity.type, item.weight, item.distance, item.time);       
	       console.log(`${item.user} burned ${current.calculate()} calories by ${item.activity.type}! `);
	   });
    } finally{
	//no matter what we want to close the connection when finished
	await client.close();
    }

}
//catch any errors (Mongo yells at us if we don't include a catch)
run().catch(console.dir);
const { MongoClient } = require("mongodb");

const uri = "mongodb://heamanathanadmin:heamanathanadmin@ac-dg2c17r-shard-00-00.0mkiivp.mongodb.net:27017,ac-dg2c17r-shard-00-01.0mkiivp.mongodb.net:27017,ac-dg2c17r-shard-00-02.0mkiivp.mongodb.net:27017/academic_compass?authSource=admin&replicaSet=atlas-yk8bkj-shard-0&appName=Cluster0&ssl=true";

async function run() {
  const client = new MongoClient(uri);
  try {
    console.log("Connecting...");
    await client.connect();
    console.log("Connected successfully to server");
  } catch(e) {
    console.error("Connection failed:", e);
  } finally {
    await client.close();
  }
}

run();

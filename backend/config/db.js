import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoServer;

export const connectDB = async () => {
  try {
    let uri = process.env.MONGO_URI;

    if (process.env.USE_MOCK_DATA === "true") {
      mongoServer = await MongoMemoryServer.create();
      uri = mongoServer.getUri();
      console.log(`✅ MongoDB Connection Bypassed: Using In-Memory Database`);
    }

    const conn = await mongoose.connect(uri);

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`⚠️  MongoDB Connection Error: ${error.message}`);
    throw error;
  }
};

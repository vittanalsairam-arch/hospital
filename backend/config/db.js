const mongoose = require('mongoose');
const path = require('path');

let mongoServerInstance = null;

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 3000
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.warn(`Local MongoDB connection failed (${error.message}). Starting MongoMemoryServer fallback...`);
    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      mongoServerInstance = await MongoMemoryServer.create({
        instance: { launchTimeout: 60000 },
        binary: { downloadDir: path.join(__dirname, '../node_modules/.cache/mongodb-memory-server') }
      });
      const mongoUri = mongoServerInstance.getUri();
      const conn = await mongoose.connect(mongoUri);
      console.log(`MongoDB Memory Server Connected: ${conn.connection.host}`);

      // Auto-seed in-memory database
      const seedDatabase = require('../seed/seed');
      console.log('Seeding initial data into in-memory database...');
      await seedDatabase(true);
    } catch (memError) {
      console.error(`MongoDB Memory Server Fallback Error: ${memError.message}`);
      console.error(`Retrying connection in 5 seconds...`);
      setTimeout(connectDB, 5000);
    }
  }
};

module.exports = connectDB;



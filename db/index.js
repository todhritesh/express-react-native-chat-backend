const mongoose = require('mongoose');
const {MONGODB_URI} = require('../config')

let isConnected = false;

const connectDB = async () => {
  if (isConnected) {
    return; // If already connected, return immediately
  }

  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    isConnected = true;
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

const getDBConnection = () => {
  if (!isConnected) {
    throw new Error('Database connection has not been established.');
  }

  return mongoose.connection;
};

module.exports = { connectDB, getDBConnection };

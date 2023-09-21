require('dotenv').config();
const mongoose = require('mongoose');

async function connectToDatabase() {
  try {
    await mongoose.connect(process.env.DB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Successfully connected to database');
  } catch (error) {
    console.error(error);
  }
}

module.exports = {
  connectToDatabase,
};
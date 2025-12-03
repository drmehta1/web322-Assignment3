const mongoose = require("mongoose");

async function connectMongo() {
  if (mongoose.connection.readyState === 1) return;

  await mongoose.connect(process.env.MONGO_URL);
  console.log("🍃 MongoDB Connected");
}

module.exports = connectMongo;

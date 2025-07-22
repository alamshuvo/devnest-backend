const express = require("express");
const { MongoClient } = require("mongodb");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB URI from .env
const uri = process.env.MONGODB_URI;
console.log(uri);
let db;

// Connect to MongoDB
MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((client) => {
    db = client.db(); // default DB from URI (e.g. mydb)
    console.log("MongoDB connected");

    // Start server only after DB is connected
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

// Routes
app.get("/", (req, res) => {
  res.send("Server is running...");
});

// Example: Get all users from 'users' collection
app.get("/users", async (req, res) => {
  try {
    const users = await db.collection("users").find().toArray();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

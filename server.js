const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB URI from .env
const uri = process.env.MONGODB_URI;
console.log("MongoDB URI:", uri);

// Create a MongoClient
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();
    await client.db("devsoft").command({ ping: 1 });
    console.log("✅ Successfully connected to MongoDB!");

    const db = client.db("devsoft");
    const taskCollection = db.collection("tasks"); // changed from "users" to "tasks"

    // Root
    app.get("/", (req, res) => {
      res.send("Server is running and connected to MongoDB!");
    });

    // GET all tasks
    app.get("/tasks", async (req, res) => {
      try {
        const tasks = await taskCollection.find().toArray();
        res.json(tasks);
      } catch (err) {
        res.status(500).json({ error: "Failed to fetch tasks" });
      }
    });

    // POST a new task
    app.post("/task", async (req, res) => {
      try {
        const task = req.body;
        const result = await taskCollection.insertOne(task);
        res.status(201).json(result);
      } catch (err) {
        res.status(500).json({ error: "Failed to create task" });
      }
    });

    // PUT: Update a task by ID
    app.put("/task/:id", async (req, res) => {
      try {
        const { id } = req.params;
        const updatedTask = req.body;
        console.log(updatedTask);
        const result = await taskCollection.updateOne(
          { _id: new ObjectId(id) },
          { $set: updatedTask }
        );
        res.json(result);
        console.log(result);
      } catch (err) {
        res.status(500).json({ error: "Failed to update task" });
      }
    });

    // DELETE: Remove a task by ID
    app.delete("/task/:id", async (req, res) => {
      try {
        const { id } = req.params;
        const result = await taskCollection.deleteOne({ _id: new ObjectId(id) });
        res.json(result);
      } catch (err) {
        res.status(500).json({ error: "Failed to delete task" });
      }
    });

    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
    });

  } catch (err) {
    console.error("MongoDB connection error:", err);
  }
}

run().catch(console.dir);

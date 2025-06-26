const express = require("express");
const cors = require("cors");
const path = require("path");
const { MongoClient } = require("mongodb");
require("dotenv").config();

const app = express();

// ✅ Use port from environment for hosting (important for Render)
const PORT = process.env.PORT || 10000;

// ✅ MongoDB connection string from .env
const mongoURL = process.env.MONGO_URL;
const dbName = "eventdb";

app.use(cors());
app.use(express.json());

// ✅ Serve HTML files from 'public' folder
app.use(express.static(path.join(__dirname, "public")));

let collection;

// ✅ Connect to MongoDB Atlas
MongoClient.connect(mongoURL)
  .then((client) => {
    console.log("✅ Connected to MongoDB");
    const db = client.db(dbName);
    collection = db.collection("events");

    // ✅ Start the server
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err);
  });

// ✅ Get all events
app.get("/api/events", async (req, res) => {
  try {
    const events = await collection.find().toArray();
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: "❌ Error fetching events" });
  }
});

// ✅ Add a new event
app.post("/api/events", async (req, res) => {
  const { name, type, startDate, endDate, url, eligibility, description } =
    req.body;

  if (
    !name ||
    !type ||
    !startDate ||
    !endDate ||
    !eligibility ||
    !description
  ) {
    return res
      .status(400)
      .json({ message: "❗ All required fields must be filled." });
  }

  const newEvent = {
    name,
    type,
    startDate,
    endDate,
    url: url || "",
    eligibility,
    description,
    createdAt: new Date(),
  };

  try {
    await collection.insertOne(newEvent);
    res
      .status(201)
      .json({ message: "✅ Event added successfully!", event: newEvent });
  } catch (err) {
    res.status(500).json({ message: "❌ Failed to add event" });
  }
});

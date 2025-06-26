require("dotenv").config(); // ✅ Loads .env file

const express = require("express");
const cors = require("cors");
const path = require("path");
const { MongoClient } = require("mongodb");

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Use environment variable for MongoDB URL
const mongoURL = process.env.MONGO_URL;
const dbName = "eventdb";

app.use(cors());
app.use(express.json());

// ✅ Serve static files from public directory
app.use(express.static(path.join(__dirname, "public")));

let collection;

// ✅ Connect to MongoDB
MongoClient.connect(mongoURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then((client) => {
    console.log("✅ Connected to MongoDB");
    const db = client.db(dbName);
    collection = db.collection("events");

    // ✅ Start the server *after* DB connection
    app.listen(PORT, () => {
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

// ✅ Add new event
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

const express = require("express");
const axios = require("axios");
const { randomBytes } = require("crypto");
const cors = require("cors");
const app = express();
app.use(express.json());
app.use(cors());
const PORT = 8000;
let posts = {};

app.get("/posts", async (req, res) => {
  res.send("hello there");
});

app.post("/posts/create", async (req, res) => {
  try {
    let id = randomBytes(4).toString("hex");
    const { title } = req.body;
    console.log("hello");
    posts[id] = {
      id,
      title,
    };
    await axios.post("http://event-bus-srv:8005/events", {
      event: {
        type: "PostCreated",
        data: {
          id,
          title,
        },
      },
    });
    res.status(201).send(posts[id]);
  } catch (error) {
    console.log(error, "hellop");
    res.status(500).send("Error boyss");
  }
});

app.post("/events", (req, res) => {
  const event = req.body.event;
  console.log(event, "Event from the BUS");
  res.json({ event });
});

// Start the server
app.listen(PORT, () => {
  console.log("New change for plan B");
  console.log(`Server is running on http://localhost:${PORT}`);
});

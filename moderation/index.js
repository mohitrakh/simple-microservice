const express = require("express");
const axios = require("axios");
const app = express();
app.use(express.json());
const PORT = 8004;

// In-memory data structure to store posts and their comments
const posts = {};

// Event handler
const handleEvent = async (type, data) => {
  if (type === "CommentCreated") {
    const { id, content, postId } = data;
    const status = content.includes("orange") ? "Rejected" : "Approved";
    await axios.post("http://localhost:8005/events", {
      event: {
        type: "CommentModerated",
        data: {
          id,
          content,
          postId,
          status,
        },
      },
    });
  }
};

// Route to receive events from the Event Bus
app.post("/events", async (req, res) => {
  const { event } = req.body;
  const { type, data } = event;

  console.log("Received Event:", type);
  await handleEvent(type, data);

  res.send({});
});

// Optional: expose the current state of posts and comments
app.get("/posts", (req, res) => {
  console.log("hello", posts);
  res.send(posts);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Query Service running at http://localhost:${PORT}`);
});

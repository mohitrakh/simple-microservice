const express = require("express");
const cors = require("cors");
const axios = require("axios");
const app = express();
app.use(express.json());
app.use(cors());
const PORT = 8003;

// In-memory data structure to store posts and their comments
const posts = {};

// Event handler
const handleEvent = (type, data) => {
  if (type === "PostCreated") {
    const { id, title } = data;
    posts[id] = { id, title, comments: [] };
  }

  if (type === "CommentCreated") {
    const { id, content, postId } = data;
    const post = posts[postId];
    if (post) {
      post.comments.push({ id, content });
    }
  }
  if (type === "CommentUpdated") {
    const { id, content, postId, status } = data;
    const post = posts[postId];
    const comment = post.comments.find((c) => c.id == id);
    comment.status = status;
    comment.content = content;
  }
};

// Route to receive events from the Event Bus
app.post("/events", (req, res) => {
  const { event } = req.body;
  const { type, data } = event;

  console.log("Received Event:", type);
  handleEvent(type, data);

  res.send({});
});

// Optional: expose the current state of posts and comments
app.get("/posts", (req, res) => {
  console.log("hello", posts);
  res.send(posts);
});

// Start the server
app.listen(PORT, async () => {
  console.log(`Query Service running at http://localhost:${PORT}`);
  let events = await axios.get("http://event-bus-srv:8005/events");
  events.data.forEach((element) => {
    const { type, data } = element.event;
    handleEvent(type, data);
  });
});

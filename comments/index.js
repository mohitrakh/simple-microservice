const express = require("express");
const { randomBytes } = require("crypto");
const cors = require("cors");
const axios = require("axios");
const app = express();
app.use(express.json());
app.use(cors());
const PORT = 8001;

let commentsByPostId = {};

app.post("/posts/:id/comments", async (req, res) => {
  try {
    let commentId = randomBytes(4).toString("hex");
    const id = req.params.id;
    let comments = commentsByPostId[id] || [];
    const { content } = req.body;
    comments.push({ id: commentId, content, postId: id, status: "pending" });
    commentsByPostId[id] = comments;

    // Emit event to event bus
    await axios.post("http://event-bus-srv:8005/events", {
      event: {
        type: "CommentCreated",
        data: {
          id: commentId,
          content,
          postId: id,
          status: "pending",
        },
      },
    });

    res.status(201).send(commentsByPostId);
  } catch (error) {
    console.log(error, "hellop");
    res.status(500).send("Error boyss");
  }
});

app.post("/events", async (req, res) => {
  const { event } = req.body;
  const { type, data } = event;
  console.log("Hello Event", type);
  if (type === "CommentModerated") {
    const { id, content, postId, status } = data;
    const comments = commentsByPostId[postId];
    const comment = comments.find((c) => c.id == id);
    comment.status = status;

    await axios.post("http://event-bus-srv:8005/events", {
      event: {
        type: "CommentUpdated",
        data: {
          id,
          content,
          postId,
          status,
        },
      },
    });
  }
  res.json({ event });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

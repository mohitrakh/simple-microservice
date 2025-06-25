const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(express.json());
app.use(cors());

const PORT = 8005;
let events = [];

app.post("/events", async (req, res) => {
  const event = req.body;
  console.log("I have event now yayy");
  events.push(event);

  const services = [
    "http://posts-clusterip-srv:8000/events",
    // "http://localhost:8001/events",
    // "http://localhost:8003/events",
    // "http://localhost:8004/events",
  ];

  await Promise.all(
    services.map((url) =>
      axios.post(url, event).catch((err) => {
        console.log(`Error sending event to ${url}:`, err.message);
      })
    )
  );

  res.send({ status: "OK" });
});

app.get("/events", (req, res) => {
  res.send(events);
});

app.listen(PORT, () => {
  console.log(`Event Bus running at http://localhost:${PORT}`);
});

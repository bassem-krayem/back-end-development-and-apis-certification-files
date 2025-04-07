import express from "express";
import cors from "cors";
import { nanoid } from "nanoid";
import dotenv from "dotenv";

const app = express();
dotenv.config();
app.use(cors());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

const users = [];

app.get("/", (req, res) => {
  res.sendFile(process.cwd() + "/views/index.html");
});

app.post("/api/users", (req, res) => {
  const username = req.body.username;
  const _id = nanoid();
  const user = { username, _id };
  users.push(user);
  res.json(user);
});

app.get("/api/users", (req, res) => {
  res.json(users);
});

app.post("/api/users/:id/exercises", (req, res) => {
  const id = req.params.id;
  const exercise = {
    description: req.body.description,
    duration: Number(req.body.duration),
    date: req.body.date || new Date().toDateString(),
  };

  const user = users.find((user) => user._id === id);

  if (!user.exercises) {
    user.exercises = [];
  }

  user.exercises.push(exercise);

  res.json({
    _id: user._id,
    username: user.username,
    date: exercise.date,
    duration: exercise.duration,
    description: exercise.description,
  });
});

app.get("/api/users/:id/logs", (req, res) => {
  const id = req.params.id;
  const { from, to, limit } = req.query;
  const user = users.find((user) => user._id === id);

  let log = user.exercises;

  if (from) {
    const fromDate = new Date(from);
    if (!isNaN(fromDate)) {
      log = log.filter((ex) => new Date(ex.date) >= fromDate);
    }
  }

  if (to) {
    const toDate = new Date(to);
    if (!isNaN(toDate)) {
      log = log.filter((ex) => new Date(ex.date) <= toDate);
    }
  }

  // Apply limit
  if (limit) {
    log = log.slice(0, parseInt(limit));
  }

  res.json({
    count: user.exercises.length,
    log,
  });
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});

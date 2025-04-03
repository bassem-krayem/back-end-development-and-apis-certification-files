import "dotenv/config"; // dotenv can be imported directly
import express from "express";
import cors from "cors";
import dns from "dns";
import { nanoid } from "nanoid"; // nanoid requires named import

const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use("/public", express.static(`${process.cwd()}/public`));

app.use(express.urlencoded({ extended: true }));

const urls = [];

function isValidURL(submittedURL) {
  return new Promise((resolve) => {
    try {
      const parsedURL = new URL(submittedURL);
      const hostname = parsedURL.hostname;

      dns.lookup(hostname, (err) => {
        resolve(!err); // Returns true if no error, false otherwise
      });
    } catch (error) {
      resolve(false); // Invalid URL format
    }
  });
}

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

// Your first API endpoint
app.get("/api/hello", function (req, res) {
  res.json({ greeting: "hello API" });
});

app.post("/api/shorturl", async (req, res) => {
  const longUrl = req.body.url;

  if (!(await isValidURL(longUrl))) {
    return res.json({ error: "invalid url" });
  }

  const shortUrl = nanoid(6);

  urls.push({
    longUrl,
    shortUrl,
  });
  console.log(urls);

  res.json({
    original_url: longUrl,
    short_url: shortUrl,
  });
});

app.param("shortUrl", (req, res, next, val) => {
  console.log(val);
  const entry = urls.find((url) => url.shortUrl === val);
  if (entry) {
    req.entry = entry;
    next();
  } else {
    return res.json({ error: "invalid url" });
  }
});

app.get("/api/shorturl/:shortUrl", (req, res) => {
  console.log(req.params.shortUrl);
  res.redirect(req.entry.longUrl);
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});

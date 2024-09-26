// index.js
// where your node app starts
import express from 'express';
import cors from 'cors'
import path from 'path';
import { fileURLToPath } from 'url';

// init project

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 

app.use(cors({optionsSuccessStatus: 200}));  // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});


// your first API endpoint... 
app.get("/api/hello", (req, res) => {
  res.json({greeting: 'hello API'});
});

function isUnixTimestamp(value) {
  return typeof value === 'number' && value > 0;
}

function isUTCDateString(value) {
  const parsedDate = Date.parse(value);
  return !isNaN(parsedDate);
}

app.get('/api/:date?', (req, res) => {
  let dateString = req.params.date;

  // If no date is provided, return the current date
  if (!dateString) {
    const currentDate = new Date();
    res.json({
      unix: currentDate.getTime(),
      utc: currentDate.toUTCString()
    });
  } else {
    // Check if dateString is a Unix timestamp (pure number)
    if (!isNaN(dateString)) {
      // Convert Unix timestamp to an integer
      dateString = parseInt(dateString);

      const unixDate = new Date(dateString);
      if (!isNaN(unixDate.getTime())) {
        res.json({
          unix: unixDate.getTime(),
          utc: unixDate.toUTCString()
        });
      } else {
        res.json({ error: "Invalid Date" });
      }
    } else {
      // Try to parse the date string as a UTC string
      const utcDate = new Date(dateString);

      if (!isNaN(utcDate.getTime())) {
        res.json({
          unix: utcDate.getTime(),
          utc: utcDate.toUTCString()
        });
      } else {
        res.json({ error: "Invalid Date" });
      }
    }
  }
});

// Listen on port set in environment variable or default to 3000
const listener = app.listen(process.env.PORT || 3000, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});

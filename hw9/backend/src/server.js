import express from 'express';
import cors from 'cors';
import db from './db.js';
import routes from './routes/index.js';
import bodyParser from 'body-parser';
import path from "path";

const app = express();
const port = process.env.PORT || 4000;

db.connect();

if (process.env.NODE_ENV === "development") {
    app.use(cors());
}


app.use(bodyParser.json());
app.use('/', routes);

if (process.env.NODE_ENV === "production") {
    const __dirname = path.resolve();
    app.use(express.static(path.join(__dirname, "../frontend", "build")));
    app.get("/*", function (req, res) {
      res.sendFile(path.join(__dirname, "../frontend", "build", "index.html"));
    });
  }

app.listen(port, () =>
    console.log(`Example app listening on port ${port}!`),
);
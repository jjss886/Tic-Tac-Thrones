const express = require("express");
const path = require("path");
const morgan = require("morgan");
const bodyParser = require("body-parser");

const app = express();
const port = process.env.PORT || 8080;

app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "./public")));

app.get("*", (req, res, next) => {
  res.sendFile(path.join(__dirname, "./public/index.html"));
});

app.listen(port, () => console.log(`Listening on port: ${port}`));

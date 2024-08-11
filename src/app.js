const dotenv = require("dotenv");
const morgan = require("morgan");
const express = require("express");
const indexRouter = require("./api/routes/index.route");

require("./server");

const app = express();
app.use(morgan("combined"));
app.use(express.json());

// app.use("/api", (req, res, next) => {
//     res.send("hello");
//   });

app.use("/api", indexRouter);

app.use("*", (req, res, next) => {
  res.status(404).send("Page not found");
});

//define port

app.listen(3000, () => console.log("app started at 3000..."));

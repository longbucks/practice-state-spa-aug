// const http = require("http");

// const server = http.createServer((request, response) => {
//   if (request.url === "/status" && request.method === "GET") {
//     response.writeHead(200, { "Content-Type": "application/json" });
//     response.write(JSON.stringify({ message: "Service healthy" }));
//     response.end();
//   }
// });

// server.listen(4040);
// console.log("Listening on port 4040");

// node way of starting up a server

const express = require("express");
const pizzas = require("./routes/pizzas");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
dotenv.config();
const app = express();

mongoose.connect(process.env.MONGODB);
const db = mongoose.connection;

db.on("error", console.error.bind(console, "Connection error:"));
db.once(
  "open",
  console.log.bind(console, "Successfully opened connection to Mongo!")
);
const logging = (req, res, next) => {
  console.log(`${req.method}${req.url}${Date.now()}`);
  next();
};
const cors = (req, res, next) => {
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type, Accept,Authorization,Origin"
  );
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
};

app.use(express.json());
app.use(cors);

app.use(logging);
app.use("/pizzas", pizzas);

app
  .route("/status", (req, res) => {
    res.status(200).json({ message: "service healthy" });
  })
  .post((req, res) => {
    res.json({ requestBody: req.body });
  });

app.route("/users/:id").get((req, res) => {
  // express adds a "params" Object to requests

  const id = req.params.id;
  // handle GET request for post with an id of "id"
  res.send(JSON.stringify({ user_id: id }));
});
const PORT = process.env.PORT || 4040;
app.listen(PORT, () => console.log(`listen on port ${PORT}`));

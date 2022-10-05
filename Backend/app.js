const PORT = 80 || 443;
const express = require("express");
const bodyParser = require("body-parser");
const router = express.Router();
require('dotenv').config()

// ADD THIS
var cors = require("cors");

const app = express();
const mongoose = require("mongoose");
const Fruits = require("./models/fruits");

//connecting DB
const DBurl =process.env.MONGODB_URL;
mongoose.connect(DBurl);
var db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function callback() {
  console.log("Mongo DB connected...");
});

// importing middleware
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "x-access-token, Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  console.log("Request received");
  res.json({ status: "working" });
});

// creating data in database
function createFruitList(fruitList) {
  // fruitList
  const fruistList = fruitList;

  //create fruitlist
  Fruits.create(fruistList).then(console.log("data inserted"));
}

app.post("/fruitlist/update", (req, res) => {
  console.log("Request received in backend.");
  console.log("req.body", req.body);
 // createFruitList(req.body);
  res.json({ status: "data received" }).status(200);
});

// getting single fruit data from frontend and storing in backend
app.post("/fruitlist/add", (req, res) => {
    console.log("add new fruit Request received in backend.");
    console.log("req.body", req.body);
    createFruitList(req.body,()=>{
        //res.json({ status: "new fruit added successfully." }).status(200);

    });
    res.json({ status: "new fruit added successfully." }).status(200);
  });

// getting all data from mongodb
app.get("/fruitlist/all", (req, res) => {
  //find all articles
  Fruits.find({}, (err, foundFruits) => {
    console.log("found article" + foundFruits);

    // responding to  frontend
    res.json(foundFruits).status(200);
  });
});

app.listen(PORT, console.log("app started on server", PORT));

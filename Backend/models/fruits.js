var mongoose = require("mongoose");

var fruits = new mongoose.Schema({
  tag: {
    type: String,
    require:true,
  },
  id: {
    type: String,
    require:true,
  },
  content: {
    type: String,
    require:true,
  },
});

var Fruits = mongoose.model("fruits", fruits);
module.exports = Fruits;

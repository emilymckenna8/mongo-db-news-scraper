const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ItemSchema = new Schema({
  albumName:{
    type: String,
    required: true
  },
  artist: {
    type: String, 
    required: true
  },
  link: {
    type: String,
    required: true
  },
  img: {
    type: String,
  },
  comments: [
    {
      type: Schema.Types.ObjectId,
      ref: "Comment"
    }
  ],
  numComments: {
    type: Boolean,
    default: false
  }
});

const Item = mongoose.model("Item", ItemSchema);

module.exports = Item;
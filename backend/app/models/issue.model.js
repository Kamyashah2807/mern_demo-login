const mongoose = require("mongoose");

const Issue = mongoose.model(
  "Issue",
  new mongoose.Schema({
    title: {
      type:String,
    },
    description: {
      type: String,
    },
    status: {
      type:String,
    },
    image: {
      type: String,
    },
    is_delete: { 
      type: Boolean, 
      default: false 
    },
	  date : { 
      type : Date, 
      default: Date.now 
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  })
);

module.exports = Issue;
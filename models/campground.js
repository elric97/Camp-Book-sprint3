var mongoose = require("mongoose");

//schema set up
var campgroundSchema = new mongoose.Schema(
    {
       name: String,
       image: String,
       description: String,
       location: String,
       cost: Number,
       author:
       {
           id: 
           {
               type: mongoose.Schema.Types.ObjectId,
               ref: "User"
           },
           username: String
       },
       comments:[
           {
               type: mongoose.Schema.Types.ObjectId,
               ref: "Comment" //name of model
           }]
    });
    
module.exports = mongoose.model("Campground",campgroundSchema);
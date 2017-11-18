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
           username: String,
           phonenumber: String
       },
       comments:[
           {
               type: mongoose.Schema.Types.ObjectId,
               ref: "Comment" //name of model
           }],
        bookings: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Booking"
            }]
    });
    
module.exports = mongoose.model("Campground",campgroundSchema);
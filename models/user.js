var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var userSchema = new mongoose.Schema(
    {
        email: String,
        phonenumber: String,
        city: String,
        username: String,
        password: String
    });
    
userSchema.plugin(passportLocalMongoose); //adds methods to the user 
    
module.exports = mongoose.model("User",userSchema);
var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var userSchema = new mongoose.Schema(
    {
        email: String,
        phonenumber: String,
        avatar: String,
        city: String,
        username: String,
        password: String,
        isAdmin: {type: Boolean, default: false}
    });
    
userSchema.plugin(passportLocalMongoose); //adds methods to the user 
    
module.exports = mongoose.model("User",userSchema);
var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");

//main route
router.get("/",function(req,res)
{
    res.render("landing");
});

//Auth routes
//show register
router.get("/register",function(req, res) 
{
    res.render("register");
});
//handle sign up 
router.post("/register",function(req,res)
{
    //now we have to register the user 
    //we don't store password directly in database rather we pass it as an argument so that it is hashed
    // and stored in database- salt used to retrieve the password from hashed value 
    User.register(new User({email: req.body.email,phonenumber: req.body.contact,city: req.body.city,username: req.body.username,}), req.body.password, function(err,user)
    {
        if(err)
        {
            req.flash("error",err.message);
            return res.redirect("/register");
        }
        //if no error then authenticate the user 
        passport.authenticate("local")(req,res,function()
        {
            res.redirect("/campgrounds");
        });
    });
});
//about page
router.get("/about",function(req,res)
{
    res.render("about");
});
//show login form
router.get("/login",function(req, res) 
{
    res.render("login");    
});
//use middleware
router.post("/login",passport.authenticate("local",
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/login",
        failureFlash: "Invalid Credentials"
    }),function(req,res)
    {
        
    });
    
//logout route
router.get("/logout",function(req, res) {
    req.logout();
    res.redirect("/campgrounds");
});

function isLoggedIn(req,res,next)
{
    if(req.isAuthenticated()) //checks if user is authenticated or not 
    {
        return next;
    }
    res.redirect("/login");
}

module.exports = router;
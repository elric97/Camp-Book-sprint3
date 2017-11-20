var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");
var Campground = require("../models/campground");
var Booking = require("../models/booking");
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
    var newUser = new User({email: req.body.email,phonenumber: req.body.contact,city: req.body.city,username: req.body.username,avatar: req.body.avatar});
    //now we have to register the user 
    //we don't store password directly in database rather we pass it as an argument so that it is hashed
    if (req.body.adminCode === "secretkey")
    {
        newUser.isAdmin = true;
    }
    // and stored in database- salt used to retrieve the password from hashed value 
    User.register(newUser, req.body.password, function(err,user)
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

//User Route
router.get("/users/:id",function(req, res) 
{
    var store;
    User.findById(req.params.id,function(err,found)
    {
        if (err)
        {
            req.flash("error","User not found");
            res.redirect("/");
        }
        Booking.find({"author.username": found.username}).exec(function(err,val)
        {
            if(err)
            {
                
            }
            else
            {
                // console.log(val);
                // store = JSON.parse(JSON.stringify(val));
                // console.log(store);
                res.render("user/show",{user: found,books: val});
            }
        });
        // Campground.find({"author.username": found.username},function(err,cfound)
        // {
        //     if(err)
        //     {
        //         res.redirect("/");
        //     }
        //     // Booking.find({"author.username": found.username},function(err,bfound)
        //     // {
        //     //     if (err)
        //     //     {
        //     //         res.redirect("/");
        //     //     }
        //     //     console.log(bfound.camp.id);
                
        //     // });
        //     res.render("user/show",{user: found,camp: cfound,books: store});
        // });
    });
});

router.get("/viewSales",function(req, res) 
{
    if(req.user)
    {
        if(!req.user.isAdmin)
        {
            req.flash("error","You need to be an Admin to access this page");
            res.redirect("/campgrounds");
        }        
    }
    else
    {
        req.flash("error","You need to be log in to view this");
        res.redirect("/login");
    }
    Campground.find({},function(err, bfound) 
    {
        if(err)
        {
            
        }
        else
        {
            res.render("sales",{book: bfound});    
        }
    });
    
});
// router.get("/campgrounds/:id/book",isLoggedIn,function(req, res) 
// {
//     res.render("book");
// });

function isLoggedIn(req,res,next)
{
    if(req.isAuthenticated()) //checks if user is authenticated or not 
    {
        return next;
    }
    req.flash("error","You need to be logged in");
    res.redirect("/login");
}

module.exports = router;
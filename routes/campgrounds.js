var express = require("express");
var router = express.Router(); //used for exporting the routes
var Campground = require("../models/campground");
var middleware = require("../middleware"); //automatically require the content of index js

//index campground
router.get("/",function(req,res)
{
    //get all campgrounds from db
    //req.user gives current user
    var noMatch = null;
    if (req.query.search)
    {
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        Campground.find({name: regex},function(err,allCampgrounds)
        {
            if(err)
            {
                console.log(err);
            }
            else
            {
                if (allCampgrounds.length < 1)
                {
                    //req.flash("failure","No such campground exist");
                    noMatch="No such campgrounds found, please search again";
                    //res.redirect("/campgrounds");
                }
                res.render("campgrounds/index",{data: allCampgrounds,currentUser: req.user,noMatch: noMatch});
            }
        });
    }
    else
    {
         Campground.find({},function(err,allCampgrounds)
        {
            if(err)
            {
                console.log(err);
            }
            else
            {
                res.render("campgrounds/index",{data: allCampgrounds,currentUser: req.user,noMatch: noMatch});
            }
        });
    }
   
    // res.render("campgrounds",{data: campgrounds});
});

//making a new campground
router.post("/",middleware.isLoggedIn, function(req,res)
{
   //get data from from and add to campfround array
   var name=req.body.name;
   var image=req.body.image;
   var dsc=req.body.description;
   var location = req.body.location;
   var cost = req.body.cost;
   var author = {
       id: req.user._id,
       username: req.user.username
   };
   var val={name: name,image: image,description: dsc,author: author,location: location,cost: cost};
   //create a new campground and save to a database 
   Campground.create(val,function(err,nval)
   {
       if(err)
       {
           console.log(err);
       }
       else
       {
           //redirect back to campground
           res.redirect("/campgrounds"); //default is a get request when redirecting so get method will run 
       }
   });
});

//a form to add new forms 
router.get("/new",middleware.isLoggedIn, function(req, res) 
{
    res.render("campgrounds/new");
});

//order is important
//shows more info about that campground
router.get("/:id",function(req, res) 
{
    //find the campground with id
    var id=req.params.id;
    //we use the populate function for this 
    Campground.findById(req.params.id).populate("comments").exec(function(err,val)
    {
        if(err || !val)
        {
            console.log(err);
        }
        else
        {
            res.render("campgrounds/show",{val: val});
        }
    });
    //show template
});

//EDIT CAMPGROUND
router.get("/:id/edit",middleware.checkOwner,function(req, res) 
{
    Campground.findById(req.params.id,function(err, val) 
    {
        if(err || !val)
        {
            res.redirect("back");
        }
        else
        {
            res.render("campgrounds/edit",{campground: val}); 
        }
    });
});

//UPDATE CAMPGROUND
router.put("/:id",middleware.checkOwner,function(req,res)
{
    
    Campground.findByIdAndUpdate(req.params.id,req.body.camp,function(err,val)
    {
        if(err)
        {
            res.redirect("/campgrounds");
        }
        else
        {
            res.redirect("/campgrounds/"+req.params.id);
        }
    });
});
//DELETE CAMPGROUND
router.delete("/:id",middleware.checkOwner,function(req,res)
{
    Campground.findByIdAndRemove(req.params.id,function(err)
    {
       if(err)
       {
           res.redirect("/campgrounds");
       }
       else
       {
           res.redirect("/campgrounds");
       }
    });
});

//middleware


function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

module.exports = router;
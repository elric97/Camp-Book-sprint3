var express = require("express");
var router = express.Router({mergeParams: true}); //for sending the id to the cooments
var Campground = require("../models/campground"),
    Comment = require("../models/comment"),
    Booking = require("../models/booking"),
    middleware = require("../middleware");
    
//new comments
router.get("/comments/new",middleware.isLoggedIn,function(req,res)
{
    Campground.findById(req.params.id,function(err,val)
    {
       if (err)
       {
           console.log(err);
       }
       else
       {
               res.render("comments/new",{val: val});
       }
    });
});

//when comments come here 
router.post("/comments",middleware.isLoggedIn,function(req,res)
{
    //lookup for campground
    Campground.findById(req.params.id,function(err, val) 
    {
        if(err)
        {
            res.redirect("/campgrounds");
        }
        else
        {
            //create a new comment
            Comment.create(req.body.comments,function(err1,val1)
            {
                if(err1)
                {
                    console.log(err1);
                }
                else
                {
                    //add username and id to the comment
                    //save comment
                    val1.author.id = req.user._id;
                    val1.author.username = req.user.username;
                    val1.save();
                    
                    val.comments.push(val1);
                    val.save();
                    req.flash("success","Comment Added");
                    res.redirect("/campgrounds/" + val._id);
                }
            });
        }
    });
});

//edit
router.get("/comments/:comments_id/edit",middleware.checkCOwner,function(req,res)
{
    Comment.findById(req.params.comments_id,function(err, val) 
    {
        if(err)
        {
            res.redirect("back");
        }
        else
        {
            res.render("comments/edit",{val_id: req.params.id,comments: val});
        }
    });
});
//comment update
router.put("/comments/:comments_id",middleware.checkCOwner,function(req,res)
{
    Comment.findByIdAndUpdate(req.params.comments_id,req.body.comments,function(err, updval)
    {
        if(err)
        {
            res.redirect("back");
        }
        else
        {
            res.redirect("/campgrounds/"+req.params.id);
        }
    });
});

//Delete route 
router.delete("/comments/:comments_id",middleware.checkCOwner,function(req, res) 
{
    Comment.findByIdAndRemove(req.params.comments_id,function(err,val)
    {
        if(err)
        {
            res.redirect("back");
        }
        else
        {
            req.flash("success","comment deleted");
            res.redirect("/campgrounds/"+req.params.id);
        }
    });
});

router.get("/book",middleware.isLoggedIn,function(req, res) 
{
    Campground.findById(req.params.id,function(err,val)
    {
       if (err)
       {
           console.log(err);
       }
       else
       {
               res.render("book",{val: val});
       }
    });
});

router.post("/book",middleware.isLoggedIn,function(req,res)
{
    Campground.findById(req.params.id,function(err,val)
    {
        if(err)
        {
            console.log(err);
        }
        else
        {
            console.log(val);
            var author = {
               id: req.user._id,
               username: req.user.username,
               phonenumber: req.user.phonenumber
            };
            var date = req.body.date;
            var camp= {
                id: req.params.id,
                name: val.name,
                image: val.image
            };
            var val2={author: author,camp: camp,date: date};
            Booking.create(val2,function(err,val3)
            {
                if(err)
                {
                    console.log(err);
                }
                else
                {
                    val.bookings.push(val3);
                    val.save();
                    req.flash("success","booked successfully");
                    res.redirect("/campgrounds/"+req.params.id);
                }
            })
        }
    })
});

//cancel booking
router.delete("/book/:book_id",function(req, res) 
{
    Booking.findByIdAndRemove(req.params.book_id,function(err,val)
    {
        if(err)
        {
            res.redirect("back");
        }
        else
        {
            req.flash("success","Booking Cancelled");
            res.redirect("/campgrounds/"+req.params.id);
        }
    });
});


//middleware to check ownership

module.exports = router;
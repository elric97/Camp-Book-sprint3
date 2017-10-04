var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    Campground = require("./models/campground"),
    Comment = require("./models/comment"),
    seedDB = require("./seeds"),
    mongoose = require("mongoose"),
    passport = require("passport"),
    localStrategy=require("passport-local"),
    User=require("./models/user"),
    methodOverride = require("method-override"),
    flash = require("connect-flash");



//requiring routes
var commentRoutes = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    authRoutes = require("./routes/index");


//seedDB(); //seed the database 
mongoose.connect("mongodb://rachit:naruto@ds157444.mlab.com:57444/yelpcamp");

app.use(bodyParser.urlencoded({extended: true})); // to set body parser to get data 
app.set("view engine","ejs");
app.use(express.static(__dirname + "/public")); // __dirname gives the current directory we are working in
//method overide
app.use(methodOverride("_method"));
//use moment
app.locals.moment = require('moment');
//use flash messages
app.use(flash());
//setup express session
app.use(require("express-session")(
    {
        secret: "Yo hoe",
        resave: false,
        saveUninitialized: false
    }));

//passport config
app.use(passport.initialize());
app.use(passport.session());
//functions coming from user model
passport.use(new localStrategy(User.authenticate())); //local strategy use that verion of authenticate coming from user model
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//we have to pass req.user to every route so we use a middleware for this
app.use(function(req,res,next)
{
    // whatever we put in res.locals is available in our templates 
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next(); //required next
});

//using routes files
//we can also add a repeating term in front of routes coming for example campgrounds in front of campground routes
app.use(authRoutes);
app.use("/campgrounds",campgroundRoutes);
app.use("/campgrounds/:id",commentRoutes);

app.listen(process.env.PORT,process.env.IP,function()
{
   console.log("Yelp Camp server started"); 
});
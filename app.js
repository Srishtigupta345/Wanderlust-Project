require('dotenv').config();
 console.log(process.env);

// 1. Basic Setup
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");

// Session & Auth
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./Models/user.js");

// Routers 
// Requiring listings
const listingRouter = require("./routes/listing.js");
// Requiring reviews
const reviewsRouter = require("./routes/review.js");
// Requiring user
const userRouter = require("./routes/user.js");

// Hosting url for atlas or db connection 
const dbUrl = process.env.ATLAS_DB_URL;

// 4. Call main Function 
mongoose.connect(dbUrl) 
.then(() => 
{
   console.log("Database Connected"); 
   // Session Store 
   const store = MongoStore.create({
     mongoUrl: dbUrl,
     crypto: {
         secret: "mysupersecretstring",
        },
     touchAfter: 24*3600,
    });
    store.on("error", (err) => {
       console.log("SESSION STORE ERROR:", err);
    });
    const sessionOptions = {
      store, // to store session information at atlas db
      secret: "mysupersecretstring",
      resave: false,
      saveUninitialized: false,
      cookie: {
          expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
          maxAge: 7 * 24 * 60 * 60 * 1000,
          httpOnly: true,
        }
    };

    // Implement passport middlewares
    app.use(passport.initialize());
    app.use(passport.session());

    app.use(session(sessionOptions));
    app.use(flash());

    // this are the static methods of model for passport session support
    passport.use(new LocalStrategy(User.authenticate()));
    passport.serializeUser(User.serializeUser());
    passport.deserializeUser(User.deserializeUser());

    // 1. Basic Setup part2
    app.listen(8080, () => {
       console.log("Server is listening on port 8080");
    });
    }).catch((err) => 
    {
      console.log("DB Connection Error:", err);
    });

//6. Set view engine
// to set layouts
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware
app.use(express.urlencoded({extended : true}));
app.use(express.json());
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

// middleware for flash or locals 
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user || null;
    next();
});

// to use listings
app.use("/listings", listingRouter);

// to use reviews
app.use("/listings/:id/reviews" , reviewsRouter);

// to use user
app.use("/", userRouter);

//For all illegal routes
app.use((req, res, next) => {
    next(new ExpressError(404, "Page Not Found!"));
});

// Error Handlling Middleware
app.use((err, req, res, next) => {
    if(res.headersSent) {
        return next(err);
    }
    let { statusCode = 500, message = "Something went wrong!!" } = err;
    res.status(statusCode).render("Error.ejs", { statusCode, message });
});


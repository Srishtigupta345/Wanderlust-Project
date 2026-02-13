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
mongoose
  .connect(dbUrl)
  .then(() => console.log("Database Connected"))
  .catch((err) => console.log("DB Error:", err));

// View Engine
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Global Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

// Session Store
const store = MongoStore.create({
    mongoUrl: dbUrl,
    touchAfter: 24 * 3600, 
});

store.on("error", (err) => {
    console.log("SESSION STORE ERROR:", err);
});

const sessionOptions = {
    store,
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    },
};

app.use(session(sessionOptions));

// Passport
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Flash
app.use(flash());

// Locals
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

// Routes
app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewsRouter);
app.use("/", userRouter);

// 404 Error Handler
app.use((err, req, res, next) => {
    const { statusCode = 500, message = "Something went wromng!" } = err;
    res.status(statusCode).render("Error.ejs", { statusCode, message });
});

// Server
const port = process.env.Port || 8080;
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});


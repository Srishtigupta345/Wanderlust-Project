const Listing = require("./Models/listing");
const Review = require("./Models/review");
const { ListingSchema, reviewSchema } = require("./schema.js");
const ExpressError = require("./utils/ExpressError.js");

// 1st middleware
module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()) {
        // storing original url
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "you must be logged in!");
        return res.redirect("/login");
    }
    next();
}

// 2nd middleware
module.exports.saveRedirectUrl = (req, res, next) => {
    if(req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}; 

// 3rd middleware
module.exports.isOwner =  async (req, res, next) => {
    let { id } = req.params;
    // Authorization for listings
    let listing = await Listing.findById(id);
    if(!listing) {
        req.flash("error", "Listing not found!");
        return res.redirect("/listings");
    }
    if (!res.locals.currUser || 
    !listing.owner._id.equals(res.locals.currUser._id)) 
    {
        req.flash("error", "You don't have permission!");
        return res.redirect(`/listings/${id}`);
    }
    next();
};

// Validation Schema middleware for listings
module.exports.validateListing = (req, res, next) => {
    let {error} = ListingSchema.validate(req.body);
    if(error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
}

// Validation Schema  midlleware for Review
module.exports.validateReview = (req, res, next) => {
    const {error} = reviewSchema.validate(req.body);
    if(error) {
        const errMsg = error.details.map(el => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
}

// 4th middleware
module.exports.isreviewAuthor =  async (req, res, next) => {
    let { id, reviewId } = req.params;
    // Authorization for review
    let review = await Review.findById(reviewId);
    if (!review) {
    req.flash("error", "Review not found!");
    return res.redirect(`/listings/${id}`);
    }
    if(!review.author.equals(res.locals.currUser._id)) {
        req.flash("error", "You don't have access to create a review!");
         return res.redirect(`/listings/${id}`);
    }
    next();
};
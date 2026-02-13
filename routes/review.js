const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/WrapAsync.js");
const { validateReview, isLoggedIn, isreviewAuthor } = require("../middleware.js");
const reviewController = require("../controllers/review.js");




// 14. Reviews Post Route
router.post("/" , isLoggedIn, validateReview, wrapAsync(reviewController.CreateReview));
// 15. Reviews Delete Route 
router.delete("/:reviewId", isLoggedIn ,isreviewAuthor,  wrapAsync(reviewController.DeleteReview));


module.exports = router;
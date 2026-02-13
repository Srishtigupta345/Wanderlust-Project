const express = require("express");
const router = express.Router();

const wrapAsync = require("../utils/WrapAsync.js");
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer = require('multer');
const { storage } = require("../cloudConfig.js");
// const upload = multer({ dest: 'uploads/'})
const upload = multer({ storage });

router.route("/")
// index route
.get( wrapAsync(listingController.index)) 
//create route
.post(isLoggedIn, upload.single('listing[image]'), validateListing, wrapAsync(listingController.CreateListing)); 
//9. New Route
router.get("/new", isLoggedIn, listingController.NewForm);

// Route for map api
router.get("/api/:id", wrapAsync(listingController.getListingData));


// 11. Edit Route
router.get("/:id/edit", isLoggedIn , isOwner, wrapAsync(listingController.EditListing));


router.route("/:id")
 // show route
.get(wrapAsync(listingController.ShowListing))
// update route
.put(isLoggedIn , isOwner, upload.single('listing[image]'), validateListing, wrapAsync(listingController.UpdateListing))
.delete(isLoggedIn ,isOwner,  wrapAsync(listingController.DeleteListing)); // delete route

// exporting the file 
module.exports = router;
const Listing = require("../Models/listing");
const axios = require("axios");

module.exports.index = async(req, res) => 
{
   const listings =  await Listing.find({});
   res.render("listings/index.ejs" , { listings });
};

module.exports.NewForm = (req, res) => {
   res.render("listings/new.ejs");
};

module.exports.ShowListing = async(req , res) => 
{
    let { id } = req.params;
    const listing = await Listing.findById(id)
      .populate({
           path: "reviews",
           populate: {
              path: "author",
            },
    })
    .populate("owner");
    if (!listing) {
        req.flash("error" , "listing you requested for does not exist!");
       return res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing });
};

module.exports.CreateListing = async (req, res) => {
    // location string
    const {city, state, country } = req.body.listing;
    let locationString = `${city}`;
    if(state && state.trim() !== "") {
        locationString += `, ${state}`;
    }
    locationString += `, ${country}`;
    // Nomination API call
    const geoResponse = await axios.get(
        "https://nominatim.openstreetmap.org/search",
        {
              params: {
              q: locationString,
              format: "json",
              limit: 1
            }
        }
    );

    console.log(geoResponse.data);

    // saftey check 
    if(!geoResponse.data.length) {
        throw new Error("Location not found");
    }
    const lat = geoResponse.data[0].lat;
    const lng = geoResponse.data[0].lon;

    console.log(lat, lng);

    // Listing object
    const newListing = new Listing(req.body.listing);

    // Geometry attach after listing
    newListing.geometry = {
        type: "Point",
        coordinates: [parseFloat(lng), parseFloat(lat)]
    };

    // image
    let url = req.file.path;
    let filename = req.file.filename;
    newListing.image = { url, filename };

    // owner
    newListing.owner = req.user._id; //Here req.user._id represents owner id

    await newListing.save();

    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
};

module.exports.EditListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error" , "listing you requested for does not exist!");
        return res.redirect("/listings");
    }
    // Image preview 
    let originalImageUrl = listing.image.url;
    originalImageUrl=  originalImageUrl.replace("/upload", "/upload/w_250");
     res.render("listings/edit.ejs", { listing, originalImageUrl }); 
};

module.exports.UpdateListing = async (req, res) => {
    let { id } = req.params;

    // 1️⃣ Extract structured location fields
    const { city, state, country } = req.body.listing;

    // 2️⃣ Build clean geocoding string
    let locationString = `${city}`;
    if (state && state.trim() !== "") {
        locationString += `, ${state}`;
    }
    locationString += `, ${country}`;

    // 3️⃣ Call Nominatim API
    const geoResponse = await axios.get(
        "https://nominatim.openstreetmap.org/search",
        {
            params: {
                q: locationString,
                format: "json",
                limit: 1
            }
        }
    );

    // 4️⃣ Safety check
    if (!geoResponse.data.length) {
        throw new Error("Location not found");
    }

    const lat = geoResponse.data[0].lat;
    const lon = geoResponse.data[0].lon;

    // 5️⃣ Attach geometry to update payload
    req.body.listing.geometry = {
        type: "Point",
        coordinates: [parseFloat(lon), parseFloat(lat)]
    };

    // 6️⃣ Update listing (without image first)
    let listing = await Listing.findByIdAndUpdate(
        id,
        { ...req.body.listing },
        { new: true }
    );

    // 7️⃣ If new image uploaded
    if (typeof req.file !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = { url, filename };
        await listing.save();
    }

    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
};



module.exports.DeleteListing = async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
};

module.exports.getListingData = async (req, res) => {
    const { id } = req.params;

    const listing = await Listing.findById(id);

    if (!listing) {
        return res.status(404).json({ error: "Listing not found" });
    }

    res.json({
        geometry: listing.geometry,
        title: listing.title
    });
};

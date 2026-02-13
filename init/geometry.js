const mongoose = require("mongoose");
const axios = require("axios");
const Listing = require("../Models/listing.js");

// Create a connection to MongoDB or Create a Database
async function main() 
{
    await mongoose.connect("mongodb://127.0.0.1:27017/Wanderlust");
}

// 4. Call main Function 
main()
.then(() => {
   console.log("Database Connected for geometry"); 
   return findListingWithoutGeometry();
})
.catch((err) => {
    console.log(err);
});

// Fetch listing without geometry
const findListingWithoutGeometry = async () => {
    const listings = await Listing.find({ geometry: { $exists: false } });
    console.log("Listings Without geometry:", listings.length);

    // Print listing without geometry
    for (let listing of listings) {

    const locationString = `${listing.location}, ${listing.country}`;
    console.log("Processing:", locationString);

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

    if (!geoResponse.data.length) {
        console.log("Location not found:", locationString);
        continue;
    }

    const lat = geoResponse.data[0].lat;
    const lon = geoResponse.data[0].lon;

    console.log("Coordinates:", lat, lon);
}

};
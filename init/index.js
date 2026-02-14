require('dotenv').config();

// Initialization logic
const mongoose = require("mongoose");
const axios = require("axios");
const initData = require("./data.js");
const Listing = require("../Models/listing.js");
const User = require("../Models/user.js");

// Hosting url for atlas or db connection 
const dbUrl = process.env.ATLAS_DB_URL;

mongoose.connect(dbUrl)
.then(() => console.log("Database connected"))
.catch((err) => console.log("DB error:", err));

const initDB = async () => {
    await Listing.deleteMany({});
    await User.deleteMany({});
    console.log("Old data deleted");

    // Create a admin user
    const user = new User({
        email: "admin@test.com",
        username: "admin"
    });
    const registeredUser = await User.register(user, "adminpassword");
    console.log("Admin user created");
    const finalListings = [];
    for(let obj of initData.data) {
        const locationString = `${obj.city}, ${obj.country}`;
        try{
            const geoResponse = await axios.get(
                "https://nominatim.openstreetmap.org/search",
                {
                    params: {
                        q: locationString,
                        format: "json",
                        limit: 1
                    },
                    headers: {
                        "User-Agent": "Wanderlust-App"
                    }
                }
            );
            if(geoResponse.data.length === 0) {
                console.log("location not found:", locationString);
                continue;
            }
            const lat = geoResponse.data[0].lat;
            const lon = geoResponse.data[0].lon;

            const newObj = {
                ...obj,
                geometry: {
                    type: "Point",
                    coordinates: [parseFloat(lon), parseFloat(lat)]
                },
                owner: registeredUser._id
            };
            finalListings.push(newObj);
        } catch(err) {
            console.log("Geocoding failed for:", locationString);
        }
    } 
    await Listing.insertMany(finalListings);
    console.log("Data initialized with geometry + real owner");
};

// calling initDB function 
initDB();
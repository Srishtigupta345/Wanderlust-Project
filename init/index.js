// Initialization logic
const mongoose = require("mongoose");
const axios = require("axios");
const initData = require("./data.js");
const Listing = require("../Models/listing.js");
const User = require("../Models/user.js");

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/Wanderlust");
}

main()
    .then(() => {
        console.log("Database Connected");
        initDB();
    })
    .catch((err) => {
        console.log(err);
    });

const initDB = async () => {
    await Listing.deleteMany({});
    await User.deleteMany({});
    console.log("Old data deleted");

    // Create a real user
    const user = new User({
        email: "admin@test.com",
        username: "admin"
    });
    const registeredUser = await User.register(user, "adminpassword");
    console.log("Admin user created");
    const finalListings = [];
    for(let obj of initData.data) {
        const locationString = `${obj.location}, ${obj.country}`;
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
                city: obj.location,
                state: "",
                country: obj.country,
                geometry: {
                    type: "Point",
                    coordinates: [parseFloat(lon), parseFloat(lat)]
                },
                owner: registeredUser._id
            };
            delete newObj.location;
            finalListings.push(newObj);
        } catch(err) {
            console.log("Geocoding failed for:", locationString);
        }
    } 
    await Listing.insertMany(finalListings);
    console.log("Data initialized with geometry + real owner");
};
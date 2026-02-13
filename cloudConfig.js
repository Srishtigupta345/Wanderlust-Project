// To Require the Cloudinary library
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Now we have to configure things , this code is self created it's not copied
// Here we are passing some details to join cloudinary with our backend
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
});

// Defining storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'wanderlust_DEV',
    //format: async (req, file) => 'png', // supports promises as well
    allowedFormats: ["png", "jpeg", "jpg"], 
  },
});

// exporting 
module.exports = { cloudinary , storage };
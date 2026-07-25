const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
const envVars = require('../constant/envVars');

// configure cloudinary with your credentials
cloudinary.config({
    cloud_name: envVars.CLOUDINARY_CLOUD_NAME,
    api_key: envVars.CLOUDINARY_API_KEY,
    api_secret: envVars.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: envVars.CLOUDINARY_FOLDER,
        allow_formats: ['jpg', 'jpeg', 'png'],
    },
});

const multerMiddleware = multer({ storage: storage });

module.exports = multerMiddleware;
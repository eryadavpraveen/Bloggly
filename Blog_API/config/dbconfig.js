const mongoose = require("mongoose");
const KEYS = require("../constant/envVars")

const connectDB = async () => {
    try {
        await mongoose.connect(KEYS.MONGO_URL);
        console.log("Successfully connected MongoDB");
    } catch (error) {
        console.error("Error during connecting MongoDB: ", error);
    }
};

module.exports = connectDB;
const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");
const KEYS = require("../constant/envVars");
const { OK, INTERNAL_SERVER_ERROR, BAD_REQUEST, CREATED, NOT_FOUND, UNAUTHORISED } = require("../constant/httpStatusCode");
const { verifyAccessToken } = require("../utils/token.helper");

const authMiddleware = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res.status(UNAUTHORISED).json({
                status: "error",
                message: "Authorization token missing",
            });
        }

        const decodedToken = await verifyAccessToken(token);

        const user = await userModel
            .findById(decodedToken.id)
            .select("-password -refreshToken -resetPasswordToken -resetPasswordExpires -__v");

        if (!user) {
            return res.status(NOT_FOUND).json({
                status: "error",
                message: "User not found",
            });
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(UNAUTHORISED).json({
            status: "error",
            message: error.message,
        });
    }
};

module.exports = { authMiddleware }
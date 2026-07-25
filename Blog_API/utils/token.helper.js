const jwt = require("jsonwebtoken");
const KEYS = require("../constant/envVars");

const generateAcessToken = async (payload) => {
    const accessTokenSecret = KEYS.JWT_SECRET + "_access"
    const accessToken = await jwt.sign(payload, accessTokenSecret, {
        expiresIn: "1h"
    });

    return accessToken;
}

const generateRefreshToken = async (payload) => {
    const refreshTokenSecret = KEYS.JWT_SECRET + "_refresh"
    const refreshToken = await jwt.sign(payload, refreshTokenSecret, {
        expiresIn: "7d"
    });

    return refreshToken;
}

const verifyAccessToken = async (token) => {
    return jwt.verify(token, KEYS.JWT_SECRET + "_access");
}

const verifyRefreshToken = async (token) => {
    return jwt.verify(token, KEYS.JWT_SECRET + "_refresh");
}

module.exports = {
    generateAcessToken,
    generateRefreshToken,
    verifyAccessToken,
    verifyRefreshToken
}
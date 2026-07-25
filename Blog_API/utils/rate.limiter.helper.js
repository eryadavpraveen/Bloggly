const rateLimit = require("express-rate-limit");

const rateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: {
        status: "failure",
        message: "Too many requests from this IP, please try again after 15 minutes"
    }
});

const authRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // limit each IP to 5 login attempts per windowMs
    message: {
        status: "failure",
        message: "Too many login attempts from this IP, please try again after 15 minutes"
    }
});

module.exports = {
    rateLimiter,
    authRateLimiter
};
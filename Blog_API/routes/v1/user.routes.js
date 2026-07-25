const express = require("express");
const {
    getPublicProfileByUsername,
} = require("../../controllers/v1/user.controller");

const router = express.Router();

router.get("/:username", getPublicProfileByUsername);

module.exports = router;

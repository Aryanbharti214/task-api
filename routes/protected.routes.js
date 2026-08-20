const express = require("express");

const router = express.Router();

const {
    getProfile
} = require("../controllers/protected.controller");

router.get("/profile", getProfile);

module.exports = router;
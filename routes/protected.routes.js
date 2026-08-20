const express = require("express");

const router = express.Router();

const authMiddleware =
    require("../middleware/auth.middleware");

const {
    getProfile,
    getDashboard
} = require("../controllers/protected.controller");

router.get(
    "/profile",
    authMiddleware,
    getProfile
);

router.get(
    "/dashboard",
    authMiddleware,
    getDashboard
);

module.exports = router;
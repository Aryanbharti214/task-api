function getProfile(req, res) {
    const user = req.user;

    return res.status(200).json({
        id: user.id,
        email: user.email,
        created_at: user.created_at
    });
}

function getDashboard(req, res) {
    return res.status(200).json({
        message: "Welcome to your protected dashboard",
        user: {
            id: req.user.id,
            email: req.user.email
        }
    });
}

module.exports = {
    getProfile,
    getDashboard
};
const supabase = require("../config/supabase");

async function getProfile(req, res) {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({
                error: "Access token required"
            });
        }

        const parts = authHeader.split(" ");

        if (
            parts.length !== 2 ||
            parts[0] !== "Bearer" ||
            !parts[1]
        ) {
            return res.status(401).json({
                error: "Access token required"
            });
        }

        const token = parts[1];

        const { data, error } =
            await supabase.auth.getUser(token);

        if (error || !data.user) {
            return res.status(401).json({
                error: "Invalid or expired token"
            });
        }

        const user = data.user;

        return res.status(200).json({
            id: user.id,
            email: user.email,
            created_at: user.created_at
        });

    } catch (error) {
        console.error("Profile error:", error);

        return res.status(401).json({
            error: "Invalid or expired token"
        });
    }
}

module.exports = {
    getProfile
};
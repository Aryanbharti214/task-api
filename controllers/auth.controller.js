const supabase = require("../config/supabase");

async function signup(req, res) {
    try {
        const { email, password } = req.body;

        if (
            typeof email !== "string" ||
            !email.trim() ||
            typeof password !== "string" ||
            !password.trim()
        ) {
            return res.status(400).json({
                error: "Email and password are required"
            });
        }

        const { data, error } = await supabase.auth.signUp({
            email: email.trim(),
            password
        });

        if (error) {
            return res.status(400).json({
                error: error.message
            });
        }

        return res.status(201).json({
            user: data.user
        });

    } catch (error) {
        console.error("Signup error:", error);

        return res.status(500).json({
            error: "Internal server error"
        });
    }
}

async function login(req, res) {
    try {
        const { email, password } = req.body;

        if (
            typeof email !== "string" ||
            !email.trim() ||
            typeof password !== "string" ||
            !password.trim()
        ) {
            return res.status(400).json({
                error: "Email and password are required"
            });
        }

        const { data, error } =
            await supabase.auth.signInWithPassword({
                email: email.trim(),
                password
            });

        if (error || !data.session) {
            return res.status(401).json({
                error: "Invalid login credentials"
            });
        }

        return res.status(200).json({
            access_token: data.session.access_token,
            refresh_token: data.session.refresh_token
        });

    } catch (error) {
        console.error("Login error:", error);

        return res.status(500).json({
            error: "Internal server error"
        });
    }
}
async function logout(req, res) {
    try {
        const { error } = await supabase.auth.signOut();

        if (error) {
            return res.status(500).json({
                error: error.message
            });
        }

        return res.status(204).send();

    } catch (error) {
        console.error("Logout error:", error);

        return res.status(500).json({
            error: "Internal server error"
        });
    }
}

module.exports = {
    signup,
    login,
    logout
};
const jwt = require('jsonwebtoken');

const generateTokenAndSetCookie = (userId, name, res) => {
    const token = jwt.sign({ id: userId, userName: name }, process.env.JWT_SECRET, {
        expiresIn: "7d",
    });

    res.cookie("jwt", token, {
        maxAge: 15 * 24 * 60 * 60 * 1000, // MS
        httpOnly: true, // prevent XSS attacks
        sameSite: "strict", // CSRF attacks
        secure: process.env.NODE_ENV !== "development",
    });

    return token; // Return the generated token
};

module.exports = generateTokenAndSetCookie;

// Purpose: Contains the session configuration and middleware for renewing the session on every request

const SessionData = {
    secret: process.env.SESSION_SECRET, // Change this to a random string
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false, // Use true in production to ensure cookies are only sent over HTTPS
        httpOnly: true, // Prevents client-side JavaScript from accessing the cookies
        maxAge: 3600000
    }
};

async function RenewSession(req, res, next) {
    //Renew the session on every request
    if (req.session) { req.session.cookie.maxAge = Number(process.env.TIMEOUT) }
    next();
}


module.exports = { SessionData, RenewSession };
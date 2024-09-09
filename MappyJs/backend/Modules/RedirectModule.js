// Middleware to test if authenticated
function isAuthenticated(req, res, next) {
    if (req.session.user) {
        next();
    } else {
        res.status(200).redirect('/login/');
        //res.status(403).json({ message: 'Unauthorized' });
    }
}

module.exports = { isAuthenticated };
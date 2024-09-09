// Middleware to test if authenticated
function isAuthenticated(req, res, next) {
    if (req.session.user) {
        next();
    } else {
        res.status(200).redirect('/login/');
        //res.status(403).json({ message: 'Unauthorized' });
    }
}


function isAdmin(req, res, next) {
    if (req.session.user.adm) {
        next();
    } else {
        res.status(403).json({ message: 'Unauthorized' });
    }
}

async function Redirect(req, res, next) {


    if (req.session.user.adm) {
        res.status(200).redirect('/adminhome/');
    }

    if (!req.session.user.adm) {
        res.status(200).redirect('/userhome/');
    }

    next();
}

module.exports = { Redirect, isAuthenticated, isAdmin };

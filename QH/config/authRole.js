function authRole(role) {
    return (req, res, next) => {
        if (req.user.role == null) {
            return res.redirect('/user/selectrole');
        }
        if (req.user.role !== role) {
            res.status(401)
            return res.redirect('/');
        }
        next();
    }
}
module.exports = {
    authRole
}
module.exports = {
    eAdmin: function (req, res, next) {
        if (req.isAuthenticated() && req.user.nivel == 1) {
            return next();
        }

        req.flash("error_msg", "Você precisar ser um admin para acessar essa página!");
        res.redirect("/");

    }
}
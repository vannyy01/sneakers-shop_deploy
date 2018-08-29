const passport = require('passport');
const requireLogin = require('../middlewares/requireLogin');
const mongoose = require('mongoose');
const User = mongoose.model('users');

module.exports = (app) => {
    app.get('/auth/google',
        passport.authenticate('google',
            {
                scope: ['profile', 'email']
            })
    );

    app.get('/auth/google/callback',
        passport.authenticate('google'),
        (req, res) => {
            res.redirect('/');
        }
    );
    app.get('/api/logout', (req, res) => {
        req.logout();
        res.redirect('/');
    });
    app.get('/api/current_user', (req, res) => {
        res.send(req.user);
    });

    app.get('/api/users', requireLogin, async (req, res) => {
        await User.find({}, function (err, users) {
            if (err)
                res.status(404).send('Cannot get the users list!');
            else
                res.send(users);
        }).select(['googleID', '__id', 'email', 'role']).limit(10);
    });
};
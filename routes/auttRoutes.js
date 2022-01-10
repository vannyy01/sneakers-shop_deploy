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
        if (req.user)
            res.send(req.user);
        else
            res.send('');
    });
    app.get('/api/users/get/:id', requireLogin, async (req, res, next) => {
        try {
            await User.findById(req.params.id, function (err, user) {
                if (user === null) {
                    res.status(404).send(`Cannot get the user with id ${req.params.id}!`);
                    next(new Error(`User with id: ${req.params.id} did not found.`));
                } else if (err) {
                    res.status(500).send(`Server error occurred: ${err}`);
                } else {
                    res.status(200).send(user);
                }
            });
        } catch (error) {
            next(error);
        }
    });
    app.post('/api/user/create', requireLogin, async (req, res) => {
        //Google
        let existingUser;
        if (req.body.googleID) {
            existingUser = await User.findOne({googleID: req.body.googleID});
        }
        if (existingUser) {
            return res.status(400).send({message: 'This user has already created'});
        }
        //Email
        existingUser = await User.findOne({email: req.body.email});
        if (existingUser) {
            return res.status(400).send({message: 'This user has already created'});
        }
        req.body.googleID = req.body.googleID || '-';
        await new User({
            googleID: req.body.googleID,
            email: req.body.email,
            givenName: req.body.givenName,
            familyName: req.body.familyName,
            photo: req.body.photo
        }).save(err => {
            if (err)
                res.status(404).send({message: `Cannot create the user with email: ${req.body.email}. Error: !${err}`});
            else
                res.status(200).send("Commodity successfully created.");
        });
    });

    app.put('/api/users/edit/:id', requireLogin, async (req, res) => {
        await User.updateOne({_id: req.params.id}, req.body, function (err) {
            if (err)
                res.status(404).send(`Cannot update the user with email: ${req.body.email}. Error: !${err}`);
            else
                res.status(200).send('User has been updated.');
        });
    });
    app.get('/api/users', requireLogin, async (req, res) => {
        await User.find({}, function (err, users) {
            if (err)
                res.status(404).send('Cannot get the users list!');
            else
                res.send(users);
        }).select(['googleID', '__id', 'email', 'role', 'givenName', 'familyName']).limit(10);
    });

    app.delete('/api/users/delete/:id', requireLogin, async (req, res) => {
        await User.deleteOne({_id: req.params.id}, function (err) {
            if (err)
                res.status(404).send(`Cannot delete the user with _id: ${req.params.id}. Error: !${err}`);
            else
                res.status(200).send(`Item ${req.params.id} has successfully deleted`);
        });
    });
};
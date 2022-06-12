const passport = require('passport');
const requireLogin = require('../middlewares/requireLogin');
const mongoose = require('mongoose');
const _difference = require("lodash/difference");
const _ = require('lodash');
const User = mongoose.model('users');

module.exports = (app) => {
    const defaultFields = ['googleID', '__id', 'email', 'role', 'givenName', 'familyName'];

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
        if (req.user) {
            res.send(req.user);
        } else {
            res.send('');
        }
    });

    app.get('/api/users/get/:id', requireLogin, async (req, res, next) => {
        try {
            await User.findById(req.params.id).exec(function (err, user) {
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
            role: req.body.role,
            googleID: req.body.googleID,
            email: req.body.email,
            givenName: req.body.givenName,
            familyName: req.body.familyName,
            photo: req.body.photo
        }).save(err => {
            if (err) {
                res.status(404).send({message: `Cannot create the user with email: ${req.body.email}. Error: !${err}`});
            } else {
                res.status(200).send("Commodity successfully created.");
            }
        });
    });

    app.put('/api/users/edit/:id', requireLogin, async (req, res) => {
        await User.updateOne({_id: req.params.id}, req.body).exec(function (err) {
            if (err) {
                res.status(404).send(`Cannot update the user with email: ${req.body.email}. Error: !${err}`);
            } else {
                res.status(200).send('User has been updated.');
            }
        });
    });

    app.get('/api/users', requireLogin, async (req, res, next) => {
        try {
            const fields = req.query.fields && req.query.fields[0] !== "*" ? req.query.fields : defaultFields;
            let count;
            const filters = req.query.filters ? req.query.filters : {};
            const users = await User.find(filters).skip(+req.query.skip).limit(+req.query.limit).select(fields).exec();
            if (users !== null) {
                if (req.query.count) {
                    count = _.isEmpty(filters) ? await User.countDocuments() :
                        await User.find(filters).countDocuments();
                    return res.status(200).send({users, count, filters});
                }
                res.status(200).send({users, filters});
            } else {
                res.status(404).send(`Did not found ${{...fields}}`);
                next(new Error(`Nothing is found using: ${{...fields}}`));
            }
        } catch (error) {
            res.status(500).send(`Cannot get the users list! Error: ${error}`);
            next(error);
        }
    });

    app.get('/api/users_search', requireLogin, async (req, res, next) => {
        try {
            const fields = req.query.fields && req.query.fields[0] !== "*" ? req.query.fields : defaultFields;
            let count;
            const filters = req.query.filters ? req.query.filters : {};
            const users = await User.find(filters).or([{
                email: {
                    $regex: req.query.condition,
                    $options: "i"
                },
            }, {
                givenName: {
                    $regex: req.query.condition,
                    $options: "i"
                }
            }, {
                familyName: {
                    $regex: req.query.condition,
                    $options: "i"
                }
            }
            ]).skip(+req.query.skip).limit(+req.query.limit).select(fields).exec();
            if (users !== null) {
                if (req.query.count) {
                    count = await User.find(filters).or([{
                        email: {
                            $regex: req.query.condition,
                            $options: "i"
                        },
                    }, {
                        givenName: {
                            $regex: req.query.condition,
                            $options: "i"
                        }
                    }, {
                        familyName: {
                            $regex: req.query.condition,
                            $options: "i"
                        }
                    }]).countDocuments();
                    return res.status(200).send({users, count, filters});
                }
                res.status(200).send({users, filters});
            } else {
                res.status(404).send(`Did not found ${{...fields}}`);
                next(new Error(`Nothing is found using: ${{...fields}}`));
            }
        } catch (error) {
            res.status(500).send(`Cannot get the users list! Error: ${error}`);
            next(error);
        }
    });

    app.delete('/api/users/delete/:id', requireLogin, async (req, res, next) => {
        try {
            await User.deleteOne({_id: req.params.id}).exec();
            res.status(200).send(`User ${req.params.id} has successfully deleted`);
        } catch (error) {
            res.status(500).send(`Cannot delete the user with _id: ${req.params.id}. Error: ${error}`);
            next(error);
        }
    });

    app.delete('/api/users/delete_many', requireLogin, async (req, res, next) => {
        let result = [];
        try {
            for (let id of req.query.users) {
                await User.deleteOne({_id: req.params.id}).exec();
                result.push(id);
            }
            res.status(200).send(`Users ${[...result]} has successfully deleted.`);
        } catch (error) {
            const nonDeletedGoods = _difference(req.query.users, result);
            res.status(500).send(`Cannot delete the users with _id: ${[...nonDeletedGoods]}. Error: ${error}`);
            next(error);
        }
    });

};
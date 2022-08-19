const passport = require('passport');
const isUserAdmin = require('../middlewares/isUserAdmin');
const mongoose = require('mongoose');
const _difference = require("lodash/difference");
const _ = require('lodash');
const {PHONE_LENGTH, validateEmail, checkPassword} = require("../services/validation");
const bcrypt = require("bcrypt");
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

    app.get('/api/users/get/:id', isUserAdmin, async (req, res, next) => {
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

    app.get('/api/users/check_email', async (req, res, next) => {
        try {
            const isEmailExist = await User.findOne({email: req.query.email});
            if (isEmailExist === null) {
                res.status(200).send({status: false});
            } else {
                res.status(200).send({status: true});
            }
        } catch (error) {
            res.status(500).send(`Server error occurred: ${error}`);
            next(error);
        }
    });

    // Create user by Admin
    app.post('/api/users/create', isUserAdmin, async (req, res) => {
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
        const newUser = {
            role: req.body.role,
            googleID: req.body.googleID,
            email: req.body.email,
            givenName: req.body.givenName,
            familyName: req.body.familyName,
            photo: req.body.photo
        };
        await new User(newUser).save(err => {
            if (err) {
                res.status(404).send({message: `Cannot create the user with email: ${req.body.email}. Error: !${err}`});
            } else {
                res.status(200).send("User successfully created.");
            }
        });
    });

    app.post('/api/users/create_by_email', async (req, res) => {
        try {
            //Email
            const existingUser = await User.findOne({email: req.body.email});
            if (existingUser) {
                return res.status(400).send({message: 'This user has been already created.'});
            }
            const password = (req.body.password && checkPassword(req.body.password.trim()))
                ?? await bcrypt.hash(req.body.password, 10);
            const newUser = {
                email: (req.body.email && validateEmail(req.body.email.trim())) ? _.escape(req.body.email.trim()) : undefined,
                givenName: (req.body.givenName && req.body.givenName.trim() !== '') ? _.escape(req.body.givenName.trim()) : undefined,
                familyName: (req.body.familyName && req.body.familyName.trim() !== '') ? _.escape(req.body.familyName.trim()) : undefined,
                secondaryName: (req.body.secondaryName && req.body.secondaryName.trim() !== '') ? req.body.secondaryName : undefined,
                sex: (req.body.sex && req.body.sex.trim() !== '') ? _.escape(req.body.sex.trim()) : undefined,
                phone: (req.body.phone && req.body.phone.trim().length === PHONE_LENGTH) ? req.body.phone.trim() : undefined,
                birthday: req.body.birthday ? _.escape(req.body.birthday.trim()) : undefined,
                password
            };
            console.log({body: req.body, newUser});
            await new User(newUser).save();
            res.status(200).send("User have been successfully created.");
        } catch (error) {
            res.status(404).send({message: `Cannot create the user with email: ${req.body.email}. Error: !${error}`});
        }
    });

    app.put('/api/users/edit/:id', isUserAdmin, async (req, res) => {
        await User.updateOne({_id: req.params.id}, req.body).exec(function (err) {
            if (err) {
                res.status(404).send(`Cannot update the user with email: ${req.body.email}. Error: !${err}`);
            } else {
                res.status(200).send('User has been updated.');
            }
        });
    });

    app.get('/api/users', isUserAdmin, async (req, res, next) => {
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

    app.get('/api/users_search', isUserAdmin, async (req, res, next) => {
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

    app.delete('/api/users/delete/:id', isUserAdmin, async (req, res, next) => {
        try {
            await User.deleteOne({_id: req.params.id}).exec();
            res.status(200).send(`User ${req.params.id} has successfully deleted`);
        } catch (error) {
            res.status(500).send(`Cannot delete the user with _id: ${req.params.id}. Error: ${error}`);
            next(error);
        }
    });

    app.delete('/api/users/delete_many', isUserAdmin, async (req, res, next) => {
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
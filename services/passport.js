const mongoose = require('mongoose');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const LocalStrategy = require('passport-local').Strategy;
const keys = require('../config/keys');
const bcrypt = require("bcrypt");
const User = mongoose.model('users');

passport.serializeUser((user, done) => {
    done(null, user.id)
});

passport.deserializeUser((id, done) => {
    User.findById(id).then(user =>
        done(null, user)
    );
});

passport.use(
    new GoogleStrategy({
            clientID: keys.googleClientID,
            clientSecret: keys.googleClientSecret,
            callbackURL: '/auth/google/callback',
            proxy: true
        },
        async (accessToken, refreshToken, profile, done) => {
            const existingUser = await User.findOne({googleID: profile.id});
            if (existingUser) {
                return done(null, existingUser);
            }
            const newUser = await new User({
                googleID: profile.id,
                email: profile.emails[0].value,
                givenName: profile.name.givenName,
                familyName: profile.name.familyName,
                photo: profile.photos[0].value
            }).save();
            done(null, newUser);
        })
);

passport.use(new LocalStrategy({
    usernameField: "email",
    passwordField: "password"
} , async function verify(email, password, done) {
    try {
        const user = await User.findOne({email: email});
        if (!user) {
            return done(null, false, {message: 'Incorrect email.', ERROR: "USER_NOT_FOUND"});
        }
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return done(null, false, {message: 'Incorrect password.', ERROR: "WRONG_PASSWORD"});
        }
        return done(null, user);
    } catch (error) {
        return done(error);
    }
}));


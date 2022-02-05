const mongoose = require('mongoose');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const keys = require('../config/keys');
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
        console.log("accessToken", accessToken);
            const existingUser = await User.findOne({googleID: profile.id});
            if (existingUser) {
                return done(null, existingUser);
            }
            const newUser = await new User({googleID: profile.id,
                email: profile.emails[0].value,
                givenName: profile.name.givenName,
                familyName: profile.name.familyName,
                photo: profile.photos[0].value
            }).save();
            done(null, newUser);
        })
);
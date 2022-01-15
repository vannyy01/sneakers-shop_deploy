const mongoose = require('mongoose');
const {Schema} = mongoose;

const userSchema = new Schema({
    role: {type: Number, default: 10},
    googleID: {type: String},
    email: {type: String, unique: true},
    givenName: String,
    familyName: String,
    photo: String
});

mongoose.model('users', userSchema);
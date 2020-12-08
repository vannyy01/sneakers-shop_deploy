const mongoose = require('mongoose');
const {Schema} = mongoose;

const userSchema = new Schema({
    googleID: {type: String},
    email: {type: String, unique: true},
    role: {type: Number, default: 10},
    givenName: String,
    familyName: String,
    photo: String
});

mongoose.model('users', userSchema);
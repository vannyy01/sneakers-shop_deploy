const mongoose = require('mongoose');
const {Schema} = mongoose;

const userSchema = new Schema({
    role: {type: Number, default: 10, required: true},
    googleID: {type: String, default: '-'},
    email: {type: String, unique: true, required: true},
    givenName: {type: String, required: true},
    familyName: {type: String, required: true},
    secondName: String,
    sex: String,
    phone: {type: String, required: true},
    birthday: Date,
    password: String
});

mongoose.model('users', userSchema);
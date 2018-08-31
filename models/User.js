const mongoose = require('mongoose');
const {Schema} = mongoose;

const userSchema = new Schema({
    googleID: {type: String, unique: true},
    email: {type: String, unique: true},
    role: {type: Number, default: 10}
});

mongoose.model('users', userSchema);
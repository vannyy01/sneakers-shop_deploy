const mongoose = require('mongoose');
const {Schema} = mongoose;

const userSchema = new Schema({
    googleID: String,
    email: String,
    role: {type: Number, default: 10}
});

mongoose.model('users', userSchema);
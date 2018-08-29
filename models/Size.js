const mongoose = require('mongoose');
const {Schema} = mongoose;

const sizeSchema = new Schema({
    sizeValue: Number,
    count: Number
});

module.exports = sizeSchema;
const mongoose = require('mongoose');
const {Schema} = mongoose;

const siteOptionSchema = new Schema({
    name: {type: String, required: true, unique: true},
    label: {type: String, required: true},
    title: {type: String, required: true},
    description: {type: String, required: true},
    backgroundImage: String,
});

mongoose.model('site_options', siteOptionSchema);

module.exports = siteOptionSchema;
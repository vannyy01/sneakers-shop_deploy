const mongoose = require('mongoose');
const {Schema} = mongoose;
const Size = require('./Size');

/**
 * Base schema for other instances
 * @param props
 * @returns {module:mongoose.Schema}
 */
const commoditySchema = new Schema({
    title: String,
    brand: String,
    description: String,
    fullDescription: String,
    price: Number,
    mainImage: String,
    images: [String],
    sizes: [Size],
    type: String,
    sex: String,
    color: String,
});

mongoose.model('commodities', commoditySchema);
module.exports = commoditySchema;
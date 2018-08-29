const mongoose = require('mongoose');
const {Schema} = mongoose;

/**
 * Base schema for other instances
 * @param props
 * @returns {module:mongoose.Schema}
 */
const commoditySchema = new Schema({
    title: String,
    brand: String,
    description: String,
    price: Number,
    mainImage: String,
    images: [String],
});

mongoose.model('commodities', commoditySchema);
module.exports = commoditySchema;
const mongoose = require('mongoose');
const {Schema} = mongoose;
const Size = require('./Size');

/**
 * Base schema for other instances
 * @param props
 * @returns {module:mongoose.Schema}
 */
const commoditySchema = new Schema({
    title: {required: true, type: String},
    brand: {required: true, type: String},
    description: {required: true, type: String},
    fullDescription: String,
    price: Number,
    mainImage: {required: true, type: String},
    images: [String],
    sizes: [Size],
    type: {required: true, type: String},
    sex: {required: true, type: String},
    color: {required: true, type: String},
    discount: Boolean,
    discountPrice: Number,
}, {
    timestamps: true
});

mongoose.model('commodities', commoditySchema);
module.exports = commoditySchema;
const mongoose = require('mongoose');
const {Schema} = mongoose;

/**
 * Base schema for other instances
 * @param props
 * @returns {module:mongoose.Schema}
 */
const brandSchema = new Schema({
    label: String,
    value: String,
    count: Number
});

mongoose.model('brands', brandSchema);
module.exports = brandSchema;
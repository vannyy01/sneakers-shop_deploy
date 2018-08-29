const commoditySchema = require('./Commodity');
const mongoose = require('mongoose');
const Size = require('./Size');

const ShoeSchema = commoditySchema({
    size: [Size],
    type: String,
    sex: String,
});

mongoose.model('commodities', ShoeSchema);
const mongoose = require('mongoose');
const {Schema} = mongoose;
const commoditySchema = require('./Commodity');

const orderSchema = new Schema({
    goods: [commoditySchema],
    count: Number,
    sum: Number,
    _user: { type: Schema.Types.ObjectId, ref: 'User'},
    dateOrder: Date,
    dateSent: Date
});

mongoose.model('orders', orderSchema);
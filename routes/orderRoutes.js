const requireLogin = require('../middlewares/requireLogin');
const mongoose = require('mongoose');
const Order = mongoose.model('orders');

module.exports = app => {
    app.post('/api/order', requireLogin, (req, res) => {
        const {goods, count, sum} = req.body;
        const order = new Order({
            goods,
            count,
            sum,
            _user: req.user.id,
            dateOrder: Date.now()
        });
    })
};
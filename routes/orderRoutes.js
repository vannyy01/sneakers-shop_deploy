const isUserAdmin = require('../middlewares/isUserAdmin');
const mongoose = require('mongoose');
const Order = mongoose.model('orders');

module.exports = app => {
    app.post('/api/order', isUserAdmin, (req, res) => {
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
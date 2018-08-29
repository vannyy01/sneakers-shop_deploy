const mongoose = require('mongoose');
const Commodity = mongoose.model('commodities');

module.exports = app => {
    app.get('/api/commodity', async (req, res) => {
        await Commodity.find({}, function (err, comms) {
            if (err)
                res.status(404).send('Cannot get the goods list!');
            else
                res.send(comms);
        }).limit(10);
    });
    app.get('/api/commodity/:id', async (req, res) => {
        const Comm = await Commodity.findById(req.params.id);
        if (Comm)
            res.send(Comm);
        else
            res.status(404).send('This good does not exist. Try come back and find other goods.');
    });
};
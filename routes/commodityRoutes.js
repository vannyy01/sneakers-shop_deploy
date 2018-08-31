const mongoose = require('mongoose');
const Commodity = mongoose.model('commodities');

module.exports = app => {
    app.get('/api/commodity/:to', async (req, res) => {
        await Commodity.find({}, function (err, comms) {
            if (err)
                res.status(404).send('Cannot get the goods list!');
            else
                res.send(comms);
        }).limit(3).skip(Number.parseInt(req.params.to));
    });
    /**
    app.get('/api/commodity/:id', async (req, res) => {
        const Comm = await Commodity.findById(req.params.id);
        if (Comm)
            res.send(Comm);
        else
            res.status(404).send('This good does not exist. Try come back and find other goods.');
    });**/
};
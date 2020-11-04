const mongoose = require('mongoose');
const Commodity = mongoose.model('commodities');

function hasJsonStructure(str) {
    if (typeof str !== 'string') return false;
    try {
        const result = JSON.parse(str);
        const type = Object.prototype.toString.call(result);
        return type === '[object Object]'
            || type === '[object Array]';
    } catch (err) {
        return false;
    }
}

module.exports = app => {
    app.get('/api/commodity/:to', async (req, res) => {
        await Commodity.find({}, function (err, comms) {
            if (err)
                res.status(404).send('Cannot get the goods list!');
            else
                res.send(comms);
        }).limit(3);
    });
    app.get('/api/commodity/get/:id', async (req, res) => {
        await Commodity.findById(req.params.id, function (err, comm) {
            if (err)
                res.status(404).send('Cannot get the goods list!');
            else {
                res.send(comm);
                console.log(comm);
            }
        });
    });

    app.put('/api/commodity/edit/:id', async (req, res) => {
        await Commodity.findOneAndReplace(req.params.id, req.body, function (err, comm){
            if (err)
                res.status(404).send(`Cannot update the good !${req.params.id}`);
            else
                res.status(200).send(comm);
        })
    });
};
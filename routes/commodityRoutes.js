const mongoose = require('mongoose');
const Commodity = mongoose.model('commodities');
const requireLogin = require('../middlewares/requireLogin');

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
                res.status(404).send(err);
            else
                res.send(comms);
        }).select(['_id', 'brand', 'description', 'price', 'title', 'sex', 'type']).limit(Number.parseInt(req.params.to));
    });
    app.post('/api/commodity/create', async (req, res) => {
        const existingCommodity = await Commodity.findOne({
            brand: req.body.brand,
            title: req.body.title,
            sex: req.body.sex
        });
        if (existingCommodity) {
            res.status(445).json({message: "Commodity has already created."});
            return;
        }
        delete req.body._id;
        await new Commodity(req.body).save(err => {
            if (err)
                res.status(404).send({message: `Cannot create the good. Error: !${err}`});
            else
                res.status(200).send("Commodity successfully created.");
        });
    });
    app.get('/api/commodity/get/:id', async (req, res) => {
        await Commodity.findById(req.params.id, function (err, comm) {
            if (err)
                res.status(404).send('Cannot get the goods list!');
            else {
                res.status(200).send(comm);
            }
        });
    });

    app.put('/api/commodity/edit/:id', requireLogin, async (req, res) => {
        await Commodity.updateOne({_id: req.params.id}, req.body, {upsert: true}, function (err, comm) {
            if (err)
                res.status(404).send(`Cannot update the good with _id: ${req.params.id}. Error: !${err}`);
            else
                res.status(200).send(comm);
        });
    });

    app.delete('/api/commodity/delete/:id', requireLogin, async (req, res) => {
        await Commodity.deleteOne({_id: req.params.id}, function (err) {
            if (err)
                res.status(404).send(`Cannot delete the good with _id: ${req.params.id}. Error: !${err}`);
            else
                res.status(200).send(`Item ${req.params.id} has successfully deleted`);
        });
    });
};
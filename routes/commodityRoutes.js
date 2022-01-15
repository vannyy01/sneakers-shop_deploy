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

    app.post('/api/commodity/create', async (req, res, next) => {
        try {
            const existingCommodity = await Commodity.findOne({
                brand: req.body.brand,
                title: req.body.title,
                sex: req.body.sex
            });
            if (existingCommodity) {
                res.status(445).json({message: "Commodity has already created."});
                return;
            }
            req.body._id = undefined;
            req.body.sizes = [];
            const newCommodity = new Commodity(req.body);
            await newCommodity.save(err => {
                if (err) {
                    res.status(500).send({message: `Cannot create the good. Error: !${err}`});
                } else {
                    res.status(200).send("Commodity successfully created.");
                }
            });
        } catch (error) {
            next(error);
        }
    });

    app.get('/api/commodity/get/:id', async (req, res, next) => {
        try {
            await Commodity.findById(req.params.id).exec(function (err, comm) {
                if (comm === null) {
                    res.status(404).send(`Cannot get the item with id ${req.params.id}!`);
                    next(new Error(`Item with id: ${req.params.id} did not found.`));
                } else if (err)
                    res.status(500).send(`Server error occurred: ${err}`);
                else {
                    res.status(200).send(comm);
                }
            });
        } catch (error) {
            next(error);
        }
    });

    app.put('/api/commodity/edit/:id', requireLogin, async (req, res, next) => {
        try {
            await Commodity.updateOne({_id: req.params.id}, req.body, {upsert: true}).exec(function (err, comm) {
                if (err) {
                    res.status(500).send(`Cannot update the good with _id: ${req.params.id}. Error: !${err}`);
                } else {
                    res.status(200).send(comm);
                }
            });
        } catch (error) {
            next(error);
        }
    });

    app.delete('/api/commodity/delete/:id', requireLogin, async (req, res, next) => {
        try {
            await Commodity.deleteOne({_id: req.params.id}).exec(function (err) {
                if (err) {
                    res.status(500).send(`Cannot delete the good with _id: ${req.params.id}. Error: !${err}`);
                } else {
                    res.status(200).send(`Item ${req.params.id} has successfully deleted`);
                }
            });
        } catch (error) {
            next(error);
        }
    });
    app.get('/api/commodity', async (req, res, next) => {
        try {
            const defaultFields = ['_id', 'brand', 'title', 'description', 'price' , 'type', 'sex'];
            const fields = req.query.fields ? req.query.fields : defaultFields;
            await Commodity.find().limit(Number.parseInt(req.query.to)).select(fields).exec(function (err, comms) {
                if (comms === null) {
                    res.status(404).send(`Did not found ${err}`);
                } else if (err) {
                    res.status(500).send(err);
                } else {
                    res.status(200).send(comms);
                }
            });
        } catch (error) {
            next(error);
        }
    });

};
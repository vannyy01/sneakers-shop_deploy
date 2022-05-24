const mongoose = require('mongoose');
const Commodity = mongoose.model('commodities');
const requireLogin = require('../middlewares/requireLogin');
const {replaceTempDir, deleteFilesDir} = require("../services/handleFiles");
const _difference = require("lodash/difference");

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
                return res.status(200).send({message: "Commodity has already created.", error: true});
            }
            req.body._id = undefined;
            let createdCommodity = new Commodity(req.body);
            createdCommodity = await createdCommodity.save();
            await replaceTempDir(createdCommodity, req.user.email);
            res.status(200).send("Commodity successfully created.");
        } catch (error) {
            res.status(500).send({message: `Cannot create the good. Error: !${error}`});
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
            await Commodity.deleteOne({_id: req.params.id}).exec();
            await deleteFilesDir(req.params.id);
            res.status(200).send(`Item ${req.params.id} has successfully deleted`);
        } catch (error) {
            res.status(500).send(`Cannot delete the good with _id: ${req.params.id}. Error: !${error}`);
            next(error);
        }
    });

    app.delete('/api/commodity/delete_many', requireLogin, async (req, res, next) => {
        let result = [];
        try {
            for (let id of req.query.items) {
                await Commodity.deleteOne({_id: id});
                result.push(id);
            }
            res.status(200).send(`Items: ${[...result]} has successfully deleted.`);
        } catch (error) {
            const nonDeletedGoods = _difference(req.query.items, result);
            res.status(500).send(`Cannot delete the goods: ${[...nonDeletedGoods]}. Error: !${error}`);
            next(error);
        }
    });

    app.get('/api/commodity', async (req, res, next) => {
        try {
            const defaultFields = ['_id', 'brand', 'title', 'description', 'price', 'type', 'sex'];
            const fields = req.query.fields ? req.query.fields : defaultFields;
            let count;
            const goods = await Commodity.find().skip(+req.query.skip).limit(+req.query.limit).select(fields).exec();
            if (goods !== null) {
                if (req.query.count) {
                    count = await Commodity.countDocuments();
                    return res.status(200).send({goods, count});
                }
                res.status(200).send({goods});
            } else {
                res.status(404).send(`Did not found ${{...fields}}`);
                next(new Error(`Nothing is found using: ${{...fields}}`));
            }
        } catch (error) {
            res.status(500).send(error);
            next(error);
        }
    });
    app.get('/api/commodity_search', async (req, res, next) => {
        try {
            const defaultFields = ['_id', 'brand', 'title', 'description', 'price', 'type', 'sex'];
            const fields = req.query.fields ? req.query.fields : defaultFields;
            let count;
            const goods = await Commodity.find().or([{
                brand: {
                    $regex: req.query.condition,
                    $options: "i"
                }
            }, {
                title: {
                    $regex: req.query.condition,
                    $options: "i"
                }
            }, {
                type: {
                    $regex: req.query.condition,
                    $options: "i"
                }
            }, {
                sex: {
                    $regex: req.query.condition,
                    $options: "i"
                }
            }]).skip(+req.query.skip).limit(+req.query.limit).select(fields).exec();
            if (goods !== null) {
                if (req.query.count) {
                    count = await Commodity.find().or([{
                        brand: {
                            $regex: req.query.condition,
                            $options: "i"
                        }
                    }, {
                        title: {
                            $regex: req.query.condition,
                            $options: "i"
                        }
                    }, {
                        type: {
                            $regex: req.query.condition,
                            $options: "i"
                        }
                    }, {
                        sex: {
                            $regex: req.query.condition,
                            $options: "i"
                        }
                    }]).countDocuments();
                    return res.status(200).send({goods, count});
                }
                res.status(200).send({goods});
            } else {
                res.status(404).send(`Did not found ${{...fields}}`);
                next(new Error(`Nothing is found using: ${{...fields}}`));
            }
        } catch (error) {
            res.status(500).send(error);
            next(error);
        }
    });
};
const mongoose = require('mongoose');
const Commodity = mongoose.model('commodities');
const Brand = mongoose.model('brands');
const requireLogin = require('../middlewares/requireLogin');
const {replaceTempDir, deleteFilesDir} = require("../services/handleFiles");
const _difference = require("lodash/difference");
const _ = require("lodash");
const {isEmpty} = require("lodash");

function hasJsonStructure(str) {
    if (typeof str !== 'string') return false;
    try {
        const result = JSON.parse(str);
        const type = Object.prototype.toString.call(result);
        return type === '[object Object]' || type === '[object Array]';
    } catch (err) {
        return false;
    }
}

const setConditions = (req, action = "") => {
    const conditions = req.query.filters ? Object.assign({}, req.query.filters) : {};
    conditions.availability = conditions.availability ? +conditions.availability : -1;
    conditions.priceFrom = conditions.priceFrom ? +conditions.priceFrom : false;
    conditions.priceTo = conditions.priceTo ? +conditions.priceTo : false;
    if (conditions.availability === 1) {
        conditions.$and = [
            {sizes: {$elemMatch: {count: {$gt: 0}}}},
            {
                sizes: {
                    $exists: true,
                    $not: {$size: 0}
                }
            }];
    } else if (conditions.availability === 0) {
        conditions.$or = [
            {sizes: {$not: {$elemMatch: {count: {$ne: 0}}}}},
            {
                sizes: {
                    $exists: true,
                    $size: 0
                }
            }];
    }
    delete conditions.availability;
    if (action !== "sizes" && conditions.sizes && !isEmpty(conditions.sizes)) {
        if(conditions.$and){
            conditions.$and = [...conditions.$and, {sizes: {$elemMatch: {sizeValue: {$in: conditions.sizes}}}}];
        } else {
            conditions.$and = [{sizes: {$elemMatch: {sizeValue: {$in: conditions.sizes}}}}];
        }
    }
    delete conditions.sizes;
    if (conditions.priceFrom && conditions.priceTo) {
        conditions.price = {$gte: conditions.priceFrom, $lte: conditions.priceTo};
    } else if (conditions.priceTo) {
        conditions.price = {$lte: conditions.priceTo};
    } else if (conditions.priceFrom) {
        conditions.price = {$gte: conditions.priceFrom};
    }
    delete conditions.priceFrom;
    delete conditions.priceTo;
    console.log(conditions);
    return conditions;
};

module.exports = app => {
    const defaultFields = ['_id', 'brand', 'title', 'description', 'price', 'type', 'color', 'sex'];
    const colors = ['white', 'yellow', 'red', 'green', 'black', 'blue', 'grey', 'pink', 'brown'];
    const sizes = ['36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46', '47'];

    app.post('/api/commodity/create', async (req, res, next) => {
        try {
            const existingCommodity = await Commodity.findOne({
                brand: req.body.brand, title: req.body.title, sex: req.body.sex
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
                } else if (err) res.status(500).send(`Server error occurred: ${err}`); else {
                    res.status(200).send(comm);
                }
            });
        } catch (error) {
            res.status(500).send(error);
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
            const fields = req.query.fields && req.query.fields[0] !== "*" ? req.query.fields : defaultFields;
            const filters = req.query.filters ? req.query.filters : {};
            const conditions = setConditions(req);
            let count;
            const goods = await Commodity.find(conditions).skip(+req.query.skip).limit(+req.query.limit).select(fields).exec();
            if (goods !== null) {
                if (req.query.count) {
                    count = _.isEmpty(conditions) ? await Commodity.countDocuments() : await Commodity.find(conditions).countDocuments();
                    return res.status(200).send({goods, count, filters});
                }
                res.status(200).send({goods, filters});
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
            const fields = req.query.fields && req.query.fields[0] !== "*" ? req.query.fields : defaultFields;
            const filters = req.query.filters ? req.query.filters : {};
            const conditions = setConditions(req);
            let count;
            const goods = await Commodity.find(conditions).or([{
                brand: {
                    $regex: req.query.condition, $options: "i"
                }
            }, {
                title: {
                    $regex: req.query.condition, $options: "i"
                }
            }, {
                type: {
                    $regex: req.query.condition, $options: "i"
                }
            }, {
                sex: {
                    $regex: req.query.condition, $options: "i"
                }
            }]).skip(+req.query.skip).limit(+req.query.limit).select(fields).exec();
            if (goods !== null) {
                if (req.query.count) {
                    count = await Commodity.find(conditions).or([{
                        brand: {
                            $regex: req.query.condition, $options: "i"
                        }
                    }, {
                        title: {
                            $regex: req.query.condition, $options: "i"
                        }
                    }, {
                        type: {
                            $regex: req.query.condition, $options: "i"
                        }
                    }, {
                        sex: {
                            $regex: req.query.condition, $options: "i"
                        }
                    }]).countDocuments();
                    return res.status(200).send({goods, count, filters});
                }
                res.status(200).send({goods, filters});
            } else {
                res.status(404).send(`Did not found ${{...fields}}`);
                next(new Error(`Nothing is found using: ${{...fields}}`));
            }
        } catch (error) {
            res.status(500).send(error);
            next(error);
        }
    });

    app.post('/api/commodity/brand/create', async (req, res, next) => {
        try {
            if (!req.body.label || !req.body.value) {
                return res.status(400).send({message: "Cannot delete brand with the label|value set to undefined."});
            }
            const existingBrand = await Brand.findOne({
                label: req.body.label
            });
            if (existingBrand) {
                return res.status(400).send({message: "Brand has already created."});
            }
            req.body._id = undefined;
            let createdBrand = new Brand(req.body);
            await createdBrand.save();
            let brands = await Brand.find();
            brands = _.keyBy(brands, 'label');
            res.status(200).send(brands);
        } catch (error) {
            res.status(500).send({message: `Cannot create the brand. Error: !${error}`});
            next(error);
        }
    });

    app.get('/api/commodity/brands', async (req, res, next) => {
        try {
            const conditions = setConditions(req);
            let brands = await Brand.find().populate("count");
            if (brands !== null) {
                brands = _.keyBy(brands, 'value');
                for (const key in brands) {
                    brands[key].count = await Commodity.find({...conditions, brand: key}).countDocuments();
                }
                res.status(200).send(brands);
            } else {
                res.status(404).send(`Brands did not found.`);
                next(new Error(`Brands did not found.`));
            }
        } catch (error) {
            res.status(500).send(error);
            next(error);
        }
    });

    app.delete('/api/commodity/brand/delete/:name', requireLogin, async (req, res, next) => {
        try {
            await Brand.deleteOne({label: req.params.name}).exec();
            let brands = await Brand.find();
            brands = _.keyBy(brands, 'label');
            res.status(200).send(brands);
        } catch (error) {
            res.status(500).send(`Cannot delete the brand with label: ${req.params.label}. Error: !${error}`);
            next(error);
        }
    });

    app.get('/api/commodity/sexes', async (req, res, next) => {
        try {
            const conditions = setConditions(req);
            const sexes = {
                "чоловічі": await Commodity.find({...conditions, sex: "чоловічі"}).countDocuments(),
                "жіночі": await Commodity.find({...conditions, sex: "жіночі"}).countDocuments()
            };
            res.status(200).send(sexes);
        } catch (error) {
            res.status(500).send(error);
            next(error);
        }
    });

    app.get('/api/commodity/types', async (req, res, next) => {
        try {
            const conditions = setConditions(req);
            const types = {
                "Кросівки": await Commodity.find({...conditions, type: "Кросівки"}).countDocuments(),
                "Туфлі": await Commodity.find({...conditions, type: "Туфлі"}).countDocuments(),
                "Сланці": await Commodity.find({...conditions, type: "Сланці"}).countDocuments(),
            };
            res.status(200).send(types);
        } catch (error) {
            res.status(500).send(error);
            next(error);
        }
    });

    app.get('/api/commodity/colors', async (req, res, next) => {
        try {
            const conditions = setConditions(req);
            const colorsCount = {};
            for (const color of colors) {
                colorsCount[color] = await Commodity.find({...conditions, color}).countDocuments();
            }
            res.status(200).send(colorsCount);
        } catch (error) {
            res.status(500).send(error);
            next(error);
        }
    });

    app.get('/api/commodity/sizes', async (req, res, next) => {
        try {
            const conditions = setConditions(req, "sizes");
            const sizesCount = {};
            for (const size of sizes) {
                sizesCount[size] = await Commodity.find({...conditions, "sizes.sizeValue": size}).countDocuments();
            }
            res.status(200).send(sizesCount);
        } catch (error) {
            res.status(500).send(error);
            next(error);
        }
    });

    app.get('/api/commodity/availability', async (req, res, next) => {
        try {
            const filters = setConditions(req);
            let conditions = [];
            for (const key in filters) {
                if (key !== '$and' && key !== '$or') {
                    conditions.push({
                        [key]: Array.isArray(filters[key]) ? {$in: filters[key]} : filters[key]
                    });
                }
            }
            const availability = await Commodity.aggregate([
                {$match: conditions.length > 0 ? {$and: conditions} : {}}, {
                    $set: {
                        totalShoes: {
                            $reduce: {
                                input: "$sizes", initialValue: 0, in: {$add: ["$$value", "$$this.count"]}
                            }
                        },
                    }
                }, {
                    $project: {
                        _id: 1, title: 1, brand: 1, sex: 1, type: 1, price: 1, totalShoes: 1, availability: {
                            $cond: {if: {$eq: ["$totalShoes", 0]}, then: false, else: true}
                        }
                    }
                }]);
            res.status(200).send(availability);
        } catch (error) {
            res.status(500).send(error);
            next(error);
        }
    });

};
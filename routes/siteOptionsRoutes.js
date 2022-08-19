const mongoose = require("mongoose");
const SiteOption = mongoose.model('site_options');
const isUserAdmin= require("../middlewares/isUserAdmin");

module.exports = (app) => {
    app.get('/api/site_options/blocks', async (req, res, next) => {
        try {
            const defaultBlockContent = ['main_page_header', 'why_us_item_first', 'why_us_item_second', 'why_us_item_third'];
            const blockContent = req.query.blockContent && Array.isArray(req.query.blockContent) ? req.query.blockContent : defaultBlockContent;
            const options = await SiteOption.find({name: {$in: blockContent}}).exec();
            if (options === null) {
                res.status(404).send(`Did not found ${{...blockContent}}`);
                next(new Error(`Nothing is found using: ${{...blockContent}}`));
            } else {
                res.status(200).send(options);
            }
        } catch (error) {
            res.status(500).send(error);
            next(error);
        }
    });

    app.put('/api/site_options/blocks/edit/:name', isUserAdmin, async (req, res, next) => {
        try {
            await SiteOption.updateOne({name: req.params.name}, req.body).exec();
            res.status(200).send(`Option ${req.params.name} has been updated successfully.`);
        } catch (error) {
            res.status(500).send(error);
            next(error);
        }
    });
}
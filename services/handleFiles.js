const fs = require("fs/promises");
const uploadFile = require("../middlewares/upload");
const relativePath = "/commodities";
const directoryPath = __basedir + "/client/public/resources/commodities";

const upload = async (req, res, next) => {
    try {
        await uploadFile(req, res);
        if (req.file === undefined) {
            return res.status(400).send({message: "Please upload a file!"});
        }
        res.status(200).send({
            message: "Uploaded the file successfully: " + req.file.originalname,
        });
    } catch (error) {
        if (error.code === "LIMIT_FILE_SIZE") {
            res.status(500).send({
                message: "File size cannot be larger than 2MB!",
            });
            return next(error);
        }
        res.status(500).send({
            message: `Could not upload the file: ${req.file.originalname}. ${error}`,
        });
        next(error);
    }
};

const getListFiles = async (req, res, next) => {
    try {
        const files = await fs.readdir(`${directoryPath}/${req.params.id}`);

        let fileInfos = [];

        files.forEach((file) => {
            fileInfos.push({
                name: file,
                url: `${relativePath}/${req.params.id}/${file}`,
            });
        });

        res.status(200).send(fileInfos);
    } catch (error) {
        if (error.code === "ENOENT") {
            try {
                await fs.mkdir(`${directoryPath}/${req.params.id}`);
                res.redirect(req.get('referer'));
            } catch (createError) {
                next(createError);
            }
            return;
        }
        res.status(500).send({
            message: "Unable to scan files!",
        });
        next(error);
    }
};

const download = (req, res) => {
    const fileName = req.params.name;

    res.download(`${directoryPath}/${req.params.id}/${fileName}`, fileName, (err) => {
        if (err) {
            res.status(500).send({
                message: "Could not download the file. " + err,
            });
        }
    });
};

module.exports = {
    upload,
    getListFiles,
    download,
};
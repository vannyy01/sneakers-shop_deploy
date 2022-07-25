const fs = require("fs/promises");
const uploadFile = require("../middlewares/upload");
const relativePath = "/resources";
const envPath = process.env.__ENV__ === 'production' ? "/client/build/resources"
    : "/client/public/resources";
const directoryPath = __basedir + envPath;

const replaceTempDir = async (existingCommodity, userEmail) => {
    await fs.rename(`${directoryPath}/temp-${userEmail}`, `${directoryPath}/commodities/${existingCommodity._id}`);
};

const dirExists = async (path) => {
    try {
        await fs.access(path);
        return true;
    } catch (error) {
        return false;
    }
}

const uploadDir = async (req) => {
    let directoryName;
    if (req.user.role === 20) {
        if (req.query.dirName && req.query.dirName !== "undefined") {
            directoryName = req.query.dirName;
        } else {
            directoryName = `temp-${req.user.email}`;
            if (!(await dirExists(`${directoryPath}/${directoryName}`))) {
                await fs.mkdir(`${directoryPath}/${directoryName}`);
            }
        }
    }
    return `${directoryPath}/${directoryName}`;
};

const upload = async (req, res, next) => {
    console.log(process.env.__ENV__);
    try {
        req.query.uploadDir = await uploadDir(req);
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
        console.log(req.file);
        res.status(500).send({
            message: `Could not upload the file: ${req.file.originalname}. ${error}`,
        });
        next(error);
    }
};

const getListFiles = async (req, res, next) => {
    try {
        const userDir = `temp-${req.user.email}`;
        const nonExistedDir = `${directoryPath}/${userDir}`;
        let files = req.query.dirName === "undefined" ? [] : await fs.readdir(`${directoryPath}/${req.query.dirName}`);
        if (files.length === 0) {
            const isDirExisted = await dirExists(nonExistedDir);
            if (!isDirExisted) {
                await fs.mkdir(nonExistedDir);
            } else {
                files = await fs.readdir(nonExistedDir);
            }
        }
        let fileInfos = [];

        files.length > 0 && files.forEach((file) => {
            fileInfos.push({
                name: file,
                url: `${relativePath}/${req.query.dirName === "undefined" ? userDir : req.query.dirName}/${file}`,
            });
        });

        res.status(200).send(fileInfos);
    } catch (error) {
        if (error.code === "ENOENT") {
            try {
                await fs.mkdir(`${directoryPath}/${req.query.dirName}`);
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

const deleteFile = async (req, res, next) => {
    try {
        const {imageName, dirName} = req.query;
        const filePath = dirName ? `${directoryPath}/${dirName}` : `${directoryPath}/temp-${req.user.email}`;
        await fs.rm(`${filePath}/${imageName}`);
        res.status(200).send({
            message: `File ${imageName} in the directory ${directoryPath}/${dirName} has been successfully deleted.`
        });
    } catch (error) {
        res.status(500).send({
            message: `Unable to delete file! ${error}`,
        });
        next(error);
    }
};

const deleteFilesDir = async (id) => {
    await fs.rmdir(`${directoryPath}/${id}`, {recursive: true});
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
    replaceTempDir,
    getListFiles,
    download,
    deleteFile,
    deleteFilesDir
};
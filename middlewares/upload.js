const util = require("util");
const multer = require("multer");
const maxSize = 5 * 1024 * 1024;

let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, req.query.uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
});

let uploadFile = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        const acceptedFileTypes = ['image/jpg', 'image/jpeg', 'image/png'];

        if (acceptedFileTypes.includes(file.mimetype)) {
            return cb(null, true);
        }
        cb(null, false);
    },
    limits: {fileSize: maxSize},
}).single("file");

let uploadFileMiddleware = util.promisify(uploadFile);
module.exports = uploadFileMiddleware;
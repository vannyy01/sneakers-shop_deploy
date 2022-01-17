const util = require("util");
const multer = require("multer");
const maxSize = 5 * 1024 * 1024;
const uploadDir = commID => (process.env.__ENV__ === "production" ? `${__basedir}/client/build/resources/commodities/${commID}/`
    : `${__basedir}/client/public/resources/commodities/${commID}/`);

let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir(req.query.id) );
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
            return cb(null, true)
        }
        cb(null, false);
    },
    limits: {fileSize: maxSize},
}).single("file");

let uploadFileMiddleware = util.promisify(uploadFile);
module.exports = uploadFileMiddleware;
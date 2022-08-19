const isUserAdmin = require('../middlewares/isUserAdmin');
const {upload, download, getListFiles, deleteFile} = require("../services/handleFiles");


module.exports = (app) => {
    app.post('/api/files/upload', isUserAdmin, upload);
    app.get('/api/files/download', isUserAdmin, download);
    app.get('/api/files', getListFiles);
    app.delete('/api/files/delete', isUserAdmin, deleteFile);
}
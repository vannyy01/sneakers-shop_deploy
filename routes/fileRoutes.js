const requireLogin = require('../middlewares/requireLogin');
const {upload, download, getListFiles, deleteFile} = require("../services/handleFiles");


module.exports = (app) => {
    app.post('/api/files/upload', requireLogin, upload);
    app.get('/api/files/download', requireLogin, download);
    app.get('/api/files/:id', requireLogin, getListFiles);
    app.delete('/api/files/delete', requireLogin, deleteFile);
}
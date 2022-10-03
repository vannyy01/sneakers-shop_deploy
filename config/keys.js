if (process.env.NODE_ENV === 'production') {
    // return product set of keys
    module.exports = require('./prod');
} else {
    // return dev set of keys
    module.exports = require('./dev.js');
}
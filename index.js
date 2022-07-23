const express = require('express');
const mongoose = require('mongoose');
const cookieSession = require('cookie-session');
const boolParser = require('express-query-boolean');
const passport = require('passport');
const keys = require('./config/keys');
require('./models/User');
require('./models/Order');
require('./models/Brand');
require('./models/SiteOption');
require('./services/passport');

mongoose.connect(keys.mongoDBConnect);
const app = express();
global.__basedir = __dirname;

app.use(
    cookieSession({
        maxAge: 30 * 24 * 60 * 60 * 1000,
        keys: [keys.cookieKey]
    })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(boolParser());

require('./routes/userRoutes')(app);
require('./routes/orderRoutes')(app);
require('./routes/commodityRoutes')(app);
require('./routes/fileRoutes')(app);
require('./routes/siteOptionsRoutes')(app);

if (process.env.__ENV__ === 'production') {
    const path = require('path');
    app.use(express.static(path.join(__dirname, 'client/build')));

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    })
}
const PORT = process.env.PORT || 5000;
app.listen(PORT);

module.exports = (req, res, next) => {
    if (req.user.role !== 10 && req.user.role !== 20)
        return res.status(401).send({error: 'You must log in to continue.'});
    next();
};
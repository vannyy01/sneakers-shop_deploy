module.exports = (req, res, next) => {
    if (req.user.role !== 10)
        return res.status(401).send({error: 'You must log in to continue.'});
    next();
};
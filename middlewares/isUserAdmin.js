module.exports = (req, res, next) => {
    if (req.user.role !== 20)
        return res.status(401).send({error: 'You must log in as a Administrator to continue.'});
    next();
};
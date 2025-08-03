module.exports = (err, req, res, next) => {
    if (err) {
        res.status(500).send('Internal Server Error')
    }
}
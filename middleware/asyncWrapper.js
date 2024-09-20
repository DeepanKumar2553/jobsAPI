const asyncWrapper = (snippet) => {
    return async (req, res, next) => {
        try {
            await snippet(req, res, next)
        } catch (err) {
            next(err)
        }
    }
}

module.exports = asyncWrapper
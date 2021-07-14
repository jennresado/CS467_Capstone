module.exports = {
    validateAnimal
}

function validateAnimal(req, res, next) {
    let animal = req.body;

    if (
        animal.description &&
        animal.news_item &&
        animal.pic
    ) {
        if (!animal.date || !(animal.date instanceof Date)) {
            animal.date = new Date();
        }

        if (
            typeof animal.description !== 'string'
            || typeof animal.news_item !== 'string'
            || typeof animal.pic !== 'string'
        ) {
            return res.status(400).json({
                error:
                    "The request object attributes have one or more of the wrong type",
                stack: "Animal helpers line 25",
            });
        } else {
            next();
        }
    } else {
        return res.status(400).json({
            error: 'The request object is missing one or more required attributes',
            stack: "Animal helpers line 33"
        })
    }
}
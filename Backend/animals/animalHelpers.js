module.exports = {
    validateAnimal,
    validateAnimalEdit
}

function validateAnimal(req, res, next) {
    let animal = req.body;

    if (
        animal.description &&
        animal.news_item &&
        animal.pic
    ) {
        if (!animal.date || !(animal.date instanceof Date)) {
            animal.date_created = new Date();
            delete animal.date
            req.body = animal;
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

function validateAnimalEdit(req, res, next) {
    let animal = req.body;

    if (
        animal.description ||
        animal.news_item ||
        animal.pic || animal.date
    ) {
        if (
            (animal.description && typeof animal.description !== 'string')
            || (animal.news_item && typeof animal.news_item !== 'string')
            || (animal.pic && typeof animal.pic !== 'string') || (animal.date && !(animal.date instanceof Date))
        ) {
            return res.status(400).json({
                error:
                    "The request object attributes have one or more of the wrong type",
                stack: "Animal helpers line 55",
            });
        } else {
            next();
        }
    } else {
        return res.status(400).json({
            error: 'The request object is missing one or more required attributes',
            stack: "Animal helpers line 63"
        })
    }
}
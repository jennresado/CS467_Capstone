const Users = require("../users/usersModel");

module.exports = {
    validateAnimal,
    validateAnimalEdit,
    validateAdmin
}

function validateAnimal(req, res, next) {
    let animal = req.body;
    if (
        animal.description &&
        animal.news_item &&
        animal.pic &&
        animal.disposition &&
        animal.type &&
        animal.breeds &&
        animal.availability
    ) {
        if (!animal.date_created) {
            animal.date_created = new Date();
        }
        if (
            typeof animal.description !== 'string'
            || typeof animal.news_item !== 'string'
            || typeof animal.pic !== 'string' || (typeof animal.date_created !== 'string' && !(animal.date_created instanceof Date)) || typeof animal.disposition !== 'object' || typeof animal.type !== 'string' || typeof animal.breeds !== 'object' || typeof animal.availability !== 'string'
        ) {
            return res.status(400).json({
                error:
                    "The request object attributes have one or more of the wrong type",
                stack: "Animal helpers line 28",
            });
        } else {
            next();
        }
    } else {
        return res.status(400).json({
            error: 'The request object is missing one or more required attributes',
            stack: "Animal helpers line 36"
        })
    }
}

function validateAnimalEdit(req, res, next) {
    let animal = req.body;

    if (
        animal.description ||
        animal.news_item ||
        animal.pic || animal.date || animal.disposition || animal.type || animal.breeds || animal.availability
    ) {
        if ((animal.date && typeof animal.date === 'string' && !(animal.date instanceof Date))) {
            animal.date = new Date(animal.date)
        }

        if (
            (animal.description && typeof animal.description !== 'string')
            || (animal.news_item && typeof animal.news_item !== 'string')
            || (animal.pic && typeof animal.pic !== 'string')
            || (animal.date && !(animal.date instanceof Date))
            || (animal.disposition && typeof animal.disposition !== 'object')
            || (animal.type && typeof animal.type !== 'string')
            || (animal.breeds && typeof animal.breeds !== 'object')
            || (animal.availability && typeof animal.availability !== 'string')
        ) {
            return res.status(400).json({
                error:
                    "The request object attributes have one or more of the wrong type",
                stack: "Animal helpers line 66",
            });
        } else {
            next();
        }
    } else {
        return res.status(400).json({
            error: 'The request object is missing one or more required attributes',
            stack: "Animal helpers line 74"
        })
    }
}

async function validateAdmin(req, res, next) {
    const username = req.jwt.username;

    Users.getUserBy("username", username)
        .then((userArr) => {
            const user = userArr[0];
            if (user) {
                if (user.admin) {
                    next();
                }
            } else {
                res.status(404).json({ message: "No user with that username exists" });
            }
        }).catch(err => {
            res.status(500).json({
                error: err.message,
                errorMessage: "Could get that user",
                stack: "Animal helpers line 88",
            });
        })
}
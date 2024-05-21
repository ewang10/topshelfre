const books = require('../data/books');

let lastBookId = books.reduce((maxId, book) => Math.max(maxId, book.id), 0);

function bodyDataHas(propertyName) {
    return function (req, _, next) {
        const { data = {} } = req.body;

        if (data[propertyName]) {
            return next();
        }

        next({
            status: 400,
            message: `Data must include a ${propertyName}`
        });
    }
}

function checkBookExist(req, res, next) {
    const { id } = req.params;
    const book = books.find((book) => book.id === Number(id));

    if (book) {
        res.locals.book = book;
        return next();
    }

    next({
        status: 404,
        message: `Book ${id} not found`
    });
}

function list(_, res) {
    res.json({ data: books });
}

function create(req, res) {
    const { data = {} } = req.body;
    const newBook = {
        id: ++lastBookId,
        ...data
    };

    books.push(newBook);

    res.status(201).json({ data: newBook });
}

function read(_, res) {
    const book = res.locals.book;

    res.json({ data: book });
}

function update(req, res) {
    const book = res.locals.book;
    const { data: { title, author, published_date, price } = {} } = req.body;

    book.title = title;
    book.author = author;
    book.published_date = published_date;
    book.price = price;

    res.json({ data: book });
}

function destroy(req, res) {
    const { id } = req.params;
    const index = books.findIndex((book) => book.id == Number(id));

    books.splice(index, 1);

    res.status(204).end();
}

module.exports = {
    list,
    create: [
        bodyDataHas('title'),
        bodyDataHas('author'),
        bodyDataHas('published_date'),
        bodyDataHas('price'),
        create
    ],
    read: [checkBookExist, read],
    update: [
        checkBookExist,
        bodyDataHas('title'),
        bodyDataHas('author'),
        bodyDataHas('published_date'),
        bodyDataHas('price'),
        update
    ],
    delete: [checkBookExist, destroy]
};

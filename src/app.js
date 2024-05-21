const express = require('express');
const booksRouter = require('./books/books.router');
const errorHandler = require('./errors/errorHandler');

const app = express();

app.use(express.json());

app.use('/books', booksRouter);

app.use(errorHandler);

module.exports = app;

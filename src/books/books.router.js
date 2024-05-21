const express = require('express');
const booksController = require('./books.controller');
const methodNotAllowed = require('../errors/methodNotAllowed');

const booksRouter = express.Router();

booksRouter.route('/').get(booksController.list).post(booksController.create).all(methodNotAllowed);
booksRouter.route('/:id').get(booksController.read).put(booksController.update).delete(booksController.delete).all(methodNotAllowed);

module.exports = booksRouter;

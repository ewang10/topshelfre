const request = require('supertest');
const app = require('../src/app');
const books = require('../src/data/books');

describe('Test the book store API', () => {
    beforeEach(() => books.splice(0, books.length));

    describe('Test GET /books', () => {
        test('returns a list of books', async () => {
            const response = await request(app).get('/books');

            expect(response.status).toBe(200);
            expect(response.body.data).toEqual([]);
        });
    });

    describe('Test POST /books', () => {
        test('responds with 400 when a required field is missing', async () => {
            const newBook = {
                author: 'Author 1',
                published_date: '2022-01-01',
                price: 9.99
            };

            const response = await request(app)
                .post('/books')
                .set('Accept', 'application/json')
                .send({ data: newBook });

            expect(response.status).toBe(400);
        });

        test('responds with 400 when a required field is empty', async () => {
            const newBook = {
                title: '',
                author: 'Author 1',
                published_date: '2022-01-01',
                price: 9.99
            };

            const response = await request(app)
                .post('/books')
                .set('Accept', 'application/json')
                .send({ data: newBook });

            expect(response.status).toBe(400);
        });

        test('responds with 201 when book was successfully added', async () => {
            const newBook = {
                title: 'Book 1',
                author: 'Author 1',
                published_date: '2022-01-01',
                price: 9.99
            };

            const response = await request(app)
                .post('/books')
                .set('Accept', 'application/json')
                .send({ data: newBook });

            expect(response.status).toBe(201);
            expect(response.body.data).toEqual({
                id: 1,
                ...newBook
            });
        });
    });

    describe('Test GET /books/id', () => {
        test('returns with 404 when book id does not exist', async () => {
            const response = await request(app).get('/books/1');

            expect(response.status).toBe(404);
        });

        test('returns with 200 when book is found', async () => {
            const newBook = {
                title: 'Book 2',
                author: 'Author 2',
                published_date: '2022-01-01',
                price: 9.99
            };

            await request(app)
                .post('/books')
                .set('Accept', 'application/json')
                .send({ data: newBook });

            const response = await request(app).get('/books/2');

            expect(response.status).toBe(200);
            expect(response.body.data).toEqual({
                id: 2,
                ...newBook
            });
        });
    });

    describe('Test PUT /books/id', () => {
        test('returns with 404 when book id does not exist', async () => {
            const response = await request(app).put('/books/1');

            expect(response.status).toBe(404);
        });

        test('returns with 400 when field is empty when updating', async () => {
            const newBook = {
                title: 'Book 3',
                author: 'Author 3',
                published_date: '2022-01-01',
                price: 9.99
            };

            await request(app)
                .post('/books')
                .set('Accept', 'application/json')
                .send({ data: newBook });

            const updatedBook = {
                title: '',
                author: 'Updated Author 3',
                published_date: '2022-01-02',
                price: 19.99
            };

            const response = await request(app)
                .put('/books/3')
                .set('Accept', 'application/json')
                .send({ data: updatedBook });

            expect(response.status).toBe(400);
        });

        test('returns with 200 when book data was updated successfully', async () => {
            const newBook = {
                title: 'Book 4',
                author: 'Author 4',
                published_date: '2022-01-01',
                price: 9.99
            };

            await request(app)
                .post('/books')
                .set('Accept', 'application/json')
                .send({ data: newBook });

            const updatedBook = {
                title: 'Updated Book 4',
                author: 'Updated Author 4',
                published_date: '2022-01-02',
                price: 19.99
            };

            const updatedResponse = await request(app)
                .put('/books/4')
                .set('Accept', 'application/json')
                .send({ data: updatedBook });

            expect(updatedResponse.status).toBe(200);
            expect(updatedResponse.body.data).toEqual({
                id: 4,
                ...updatedBook
            });
        });
    });


    describe('Test DELETE /books/id', () => {
        test('returns with 404 when book id does not exist', async () => {
            const response = await request(app).delete('/books/1');

            expect(response.status).toBe(404);
        });

        test('returns with 204 when book is deleted', async () => {
            const newBook = {
                title: 'Book 5',
                author: 'Author 5',
                published_date: '2022-01-01',
                price: 9.99
            };

            await request(app)
                .post('/books')
                .set('Accept', 'application/json')
                .send({ data: newBook });

            const response = await request(app).delete('/books/5');

            expect(response.status).toBe(204);
        });
    });
});

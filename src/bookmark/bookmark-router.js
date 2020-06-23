const express = require('express')
const { v4: uuid } = require('uuid')
const logger = require('../logger')
const { bookmarks } = require('../store')
const bookmarkRouter = express.Router()
const bodyParser = express.json()

bookmarkRouter
    .route('/bookmarks').get(bodyParser,(req, res) => {
        res.send(bookmarks)
    })
    .post(bodyParser, (req, res) => {
        const id = uuid()
        const title = req.param('title')
        const description = req.param('description')
        let rating = req.param('rating')

        if (!description) {
            logger.error(`description is required`);
            return res
                .status(400)
                .send('Invalid data');
        }

        if (!rating) {
            rating = 0
        }
        else if (Number(rating) > 5 || Number(rating) < 0) {
            logger.error(`description is required`);
            return res
                .status(400)
                .send('Invalid data');
        }

        if (!title) {
            logger.error(`Title is required`);
            return res
                .status(400)
                .send('Invalid data');
        }

        const bookmark = {
            id,
            title,
            description,
            rating
        }
        bookmarks.push(bookmark);

        logger.info(`Bookmark with id ${id} created`);

        res
            .status(201)
            .location(`http://localhost:8000/card/${id}`)
            .json(bookmark);
    })

bookmarkRouter
    .route('/bookmarks/:id').get(bodyParser,(req, res) => {
        const { id } = req.params;
        const bookmark = bookmarks.find(b => b.id == id);

        if (!bookmark) {
            logger.error(`Bookmark with id ${id} not found`)
            return res
                .sendStatus(404)
                .send('Not found')
        }
        res.json(bookmark)
    })
    .delete(bodyParser,(req, res) => {
        const { id } = req.params;

        const bookmarkIndex = bookmarks.findIndex(b => b.id == id);

        if (bookmarkIndex === -1) {
            logger.error(`bookmark with id ${id} not found.`);
            return res
                .status(404)
                .send('Not found');
        }

        bookmarks.splice(bookmarkIndex, 1);

        logger.info(`Bookmark with id ${id} deleted.`);

        res
            .status(204)
            .end()
    })


module.exports = bookmarkRouter
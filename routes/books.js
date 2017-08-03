'use strict';

const Boom = require('boom');
const uuid = require('node-uuid');
const Joi = require('joi');

exports.register = function (server, options, next) {

    const db = server.app.db;

    server.route({
        method: 'GET',
        path: '/books',
        handler: function (request, reply) {

            db.books.find((err, docs) => {

                if (err) {
                    return reply(Boom.wrap(err, 'MongoDB error'));
                }

                reply(docs);
            });

        }
    });

    server.route({
        method: 'GET',
        path: '/books/{id}',
        handler: function (request, reply) {

            db.books.findOne({
                _id: request.params.id
            }, (err, doc) => {

                if (err) {
                    return reply(Boom.wrap(err, 'MongoDB error'));
                }

                if (!doc) {
                    return reply(Boom.notFound());
                }

                reply(doc);
            });

        }
    });

    server.route({
        method: 'GET',
        path: '/books/genre/{gn}',
        handler: function (request, reply) {

            db.books.find({
                genre: request.params.gn
            }, (err, doc) => {

                if (err) {
                    return reply(Boom.wrap(err, 'MongoDB error'));
                }

                if (!doc) {
                    return reply(Boom.notFound());
                }

                reply(doc);
            });

        }
    });

server.route({
        method: 'GET',
        path: '/books/author/{au}',
        handler: function (request, reply) {

            db.books.find({
                author: request.params.au
            }, (err, doc) => {

                if (err) {
                    return reply(Boom.wrap(err, 'MongoDB error'));
                }

                if (!doc) {
                    return reply(Boom.notFound());
                }

                reply(doc);
            });

        }
    });

server.route({
        method: 'GET',
        path: '/books/title/{ti}',
        handler: function (request, reply) {

            db.books.find({
                title: request.params.ti
            }, (err, doc) => {

                if (err) {
                    return reply(Boom.wrap(err, 'MongoDB error'));
                }

                if (!doc) {
                    return reply(Boom.notFound());
                }

                reply(doc);
            });

        }
    });


    server.route({
        method: 'POST',
        path: '/books',
        handler: function (request, reply) {

            const book = request.payload;

            //Create an id
            book._id = uuid.v1();

            db.books.save(book, (err, result) => {

                if (err) {
                    return reply(Boom.wrap(err, 'MongoDB error'));
                }

                reply(book);
            });
        },
        config: {
            validate: {
                payload: {
                    title: Joi.string().min(10).max(50).required(),
                    isbn: Joi.number().required(),
                    author: Joi.string().min(10).max(50).required(),
                    genre: Joi.string().required(),
                    publication: Joi.object().required().keys({
                     publicationdate:Joi.date().required(),
                      publisher:Joi.string().required()
                    }),
                    copies: Joi.object().required().keys({
                      edition:Joi.number().required(),
    
                      availability:Joi.string().required()
                    })
                    
                }
            }
        }
    });

    server.route({
        method: 'PUT',
        path: '/books/{id}',
        handler: function (request, reply) {

            db.books.update({
                _id: request.params.id
            }, {
                $set: request.payload
            }, function (err, result) {

                if (err) {
                    return reply(Boom.wrap(err, 'MongoDB error'));
                }

                if (result.n === 0) {
                    return reply(Boom.notFound());
                }
                reply().code(204);
            });
        },
        config: {
            validate: {
                payload: Joi.object({
                    title: Joi.string().min(10).max(50).optional(),
                    isbn: Joi.number().optional(),
                    author: Joi.string().min(10).max(50).optional(),
                    genre: Joi.string().optional(),
                    publication: Joi.object().optional().keys({
                      dateofpublication:Joi.date().optional(),
                      publisher:Joi.string().optional()
                    }),
                    copies: Joi.object().optional().keys({
                      edition:Joi.number().optional(),
                      quantity:Joi.number().optional(),
                      availability:Joi.string().optional()
                    })
                }).required().min(1)
            }
        }
    });

    server.route({
        method: 'DELETE',
        path: '/books/{id}',
        handler: function (request, reply) {

            db.books.remove({
                _id: request.params.id
            }, function (err, result) {

                if (err) {
                    return reply(Boom.wrap(err, 'MongoDB error'));
                }

                if (result.n === 0) {
                    return reply(Boom.notFound());
                }

                reply().code(204);
            });
        }
    });

    return next();
};

exports.register.attributes = {
    name: 'routes-books'
};

'use strict';

const Boom = require('boom');
const uuid = require('node-uuid');
const Joi = require('joi');

exports.register = function (server, options, next) {

    const db = server.app.db;

    server.route({
        method: 'GET',
        path: '/users',
        handler: function (request, reply) {

            db.users.find((err, docs) => {

                if (err) {
                    return reply(Boom.wrap(err, 'MongoDB error'));
                }

                reply(docs);
            });

        }
    });

    server.route({
        method: 'GET',
        path: '/users/{id}',
        handler: function (request, reply) {

            db.users.findOne({
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
        path: '/users/latesubmit',
        handler: function (request, reply) {

            db.users.find({
                latefees: {$gt:0}
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
        path: '/users',
        handler: function (request, reply) {

            const book = request.payload;

            //Create an id
            book._id = uuid.v1();

            db.users.save(book, (err, result) => {

                if (err) {
                    return reply(Boom.wrap(err, 'MongoDB error'));
                }

                reply(book);
            });
        },
        config: {
            validate: {
                payload: {
                    name: Joi.string().required(),
                    email: Joi.string().email(),
                    booksborrowed: Joi.object().required().keys({
                      bookid:Joi.number().required(),
                      duedate:Joi.date().required()
                    }),
                    bookreservedID:Joi.number().required(),
                    latefees:Joi.number().required(),
                }
            }
        }
    });

    server.route({
        method: 'PUT',
        path: '/users/{id}',
        handler: function (request, reply) {

            db.users.update({
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
                    name: Joi.string().optional(),
                    email: Joi.string().email().optional(),
                    booksborrowed: Joi.object().optional().keys({
                      bookid:Joi.number().optional(),
                      duedate:Joi.date().optional()
                    }),
                    bookreservedID:Joi.number().optional(),
                    latefees:Joi.number().optional(),
                }).required().min(1)
            }
        }
    });

    server.route({
        method: 'DELETE',
        path: '/users/{id}',
        handler: function (request, reply) {

            db.users.remove({
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
    name: 'routes-users'
};

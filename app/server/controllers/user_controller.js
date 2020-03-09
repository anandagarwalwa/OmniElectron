'use strict'

const { Users } = require('../models')
const {
    createError,
    BAD_REQUEST,
    UNAUTHORIZED
} = require('../helpers/error_helper')

const getUsers = () => {
    // return Users.find({ UserId: 1});
    return Users.findAll();
}

const addUser = (data) => {
    return Users.create(data).then(data => {
        console.log(data);
    }).catch(err => {
        console.log(err);
    });
}

module.exports = {
    getUsers
    , addUser
}


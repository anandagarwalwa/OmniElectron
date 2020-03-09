'use strict'

const { Users } = require('../models')
const {
    createError,
    BAD_REQUEST,
    UNAUTHORIZED
} = require('../helpers/error_helper')

const getUsers = () => {
    return Users.find({ UserId: 1});
}

module.exports = {
    getUsers
}


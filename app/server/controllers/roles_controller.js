'use strict'

const { Roles } = require('../models')
const {
    createError,
    BAD_REQUEST,
    UNAUTHORIZED
} = require('../helpers/error_helper')

const getRoles = () => {
    // return Users.find({ UserId: 1});
    return Roles.findAll();
}

module.exports = {
    getRoles
}
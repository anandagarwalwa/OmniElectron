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

const addUser=()=>
{
    return Users.create();
}

module.exports = {
    getUsers
}


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


const addRoles = (data) => {
    return Roles.create(data).then(data => {
        console.log(data);
    }).catch(err => {
        console.log(err);
    });
}

module.exports = {
    getRoles,
    addRoles
}
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

const userLogin = (data) => {
    return Users.findOne(data).catch(err => {
        console.log(err);
    });
}

const getUsersById = (id) => {
    return Users.find({ UserId: id }).catch(err => {
        console.log(err);
    });
}

const updateUserById = (userid, data) => {
    return Users.update(userid, data).catch(err => {
        console.log(err);
    });
}

module.exports = {
    getUsers
    , addUser, userLogin, getUsersById, updateUserById
}


'use strict'

const { Teams } = require('../models')
const {
    createError,
    BAD_REQUEST,
    UNAUTHORIZED
} = require('../helpers/error_helper')

const getTeams = () => {
    // return Users.find({ UserId: 1});
    return Teams.findAll();
}


const addTeams = (data) => {
    return Teams.create(data).then(data => {
        console.log(data);
    }).catch(err => {
        console.log(err);
    });
}

module.exports = {
    getTeams,
    addTeams
}
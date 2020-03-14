'use strict'

const { TeamUserMapping } = require('../models')
const {
    createError,
    BAD_REQUEST,
    UNAUTHORIZED
} = require('../helpers/error_helper')

const getTeamUserMapping = () => {   
    return TeamUserMapping.findAll();
}

const addTeamUserMapping = (data) => {
    return TeamUserMapping.create(data).then(data => {
        console.log(data);
    }).catch(err => {
        console.log(err);
    });
}

module.exports = {
    getTeamUserMapping,
    addTeamUserMapping
}
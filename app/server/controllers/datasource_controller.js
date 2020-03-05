'use strict'

const { Datasources } = require('../models')
const {
    createError,
    BAD_REQUEST,
    UNAUTHORIZED
} = require('../helpers/error_helper')

const getDatasource = () => {
    return Datasources.findAll();
}

module.exports = {
    getDatasource
}
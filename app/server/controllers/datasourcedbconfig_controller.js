'use strict'

const { DatasourceDBConfig } = require('../models')
const {
    createError,
    BAD_REQUEST,
    UNAUTHORIZED
} = require('../helpers/error_helper')

const getDatasourceDBConfig = () => {
    return DatasourceDBConfig.findAll();
}

const addDatasourceDBConfig = (data) => {
    return DatasourceDBConfig.create(data);   
}

module.exports = {
    getDatasourceDBConfig,
    addDatasourceDBConfig
}
'use strict'

const { Datacategory } = require('../models')
const {
    createError,
    BAD_REQUEST,
    UNAUTHORIZED
} = require('../helpers/error_helper')

const getDatacategory = () => {
    return Datacategory.findAll();
}


module.exports = {
    getDatacategory
} 
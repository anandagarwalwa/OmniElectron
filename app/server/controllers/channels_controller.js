'use strict'

const { Channels } = require('../models')
const {
    createError,
    BAD_REQUEST,
    UNAUTHORIZED
} = require('../helpers/error_helper')

const getChannels = () => {
    return Channels.findAll();
}

module.exports = {
    getChannels
}
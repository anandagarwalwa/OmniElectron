'use strict'

const { AlertDetail } = require('../models')

const {
    createError,
    BAD_REQUEST,
    UNAUTHORIZED
} = require('../helpers/error_helper')


const getAlertDetailByID = (id) => {
    return AlertDetail.find({ Id: id });
    //return Analysis.findAll();
}


const addAlertDetail = (data) => {
    return AlertDetail.create(data)
    // .then(data => {
    //     console.log(data);
    // }).catch(err => {
    //     console.log(err);
    // });
}

const updateAlertDetailbyID = (id, data) => {
    return AlertDetail.update({ Id: id }, data);
    // .then(data => {
    //     console.log(data);
    // }).catch(err => {
    //     console.log(err);
    // });
}

const deleteAlertDetailbyID = (nodeId) => {
    return AlertDetail.destroy({ Id: Id })
    // .then(data => {
    //     console.log(data);
    // }).catch(err => {
    //     console.log(err);
    // });
}

module.exports = {
    getAlertDetailByID,
    addAlertDetail,
    updateAlertDetailbyID,
    deleteAlertDetailbyID
}
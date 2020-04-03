'use strict'

const { AlertMaster } = require('../models')

const {
    createError,
    BAD_REQUEST,
    UNAUTHORIZED
} = require('../helpers/error_helper')


const getAlertMasterByID = (id) => {
    return AlertMaster.find({ Id: id });
    //return Analysis.findAll();
}


const addAlertMaster = (data) => {
    return AlertMaster.create(data)
    // .then(data => {
    //     console.log(data);
    // }).catch(err => {
    //     console.log(err);
    // });
}

const updateAlertMasterbyID = (id, data) => {
    return AlertMaster.update({ Id: id }, data);
    // .then(data => {
    //     console.log(data);
    // }).catch(err => {
    //     console.log(err);
    // });
}

const deleteAlertMasterbyID = (nodeId) => {
    return AlertMaster.destroy({ Id: nodeId })
    // .then(data => {
    //     console.log(data);
    // }).catch(err => {
    //     console.log(err);
    // });
}

module.exports = {
    getAlertMasterByID,
    addAlertMaster,
    updateAlertMasterbyID,
    deleteAlertMasterbyID
}
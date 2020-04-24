'use strict'

const { Alertschedule } = require('../models')

const {
    createError,
    BAD_REQUEST,
    UNAUTHORIZED
} = require('../helpers/error_helper')


const getAlertscheduleByID = (id) => {
    return Alertschedule.find({ Id: id });
    //return Analysis.findAll();
}


const addAlertschedule = (data) => {
    debugger;
    return Alertschedule.create(data)
    // .then(data => {
    //     console.log(data);
    // }).catch(err => {
    //     console.log(err);
    // });
}

const updateAlertschedulebyID = (id, data) => {
    return Alertschedule.update({ Id: id }, data);
    // .then(data => {
    //     console.log(data);
    // }).catch(err => {
    //     console.log(err);
    // });
}

const deleteAlertschedulebyID = (nodeId) => {
    return Alertschedule.destroy({ Id: Id })
    // .then(data => {
    //     console.log(data);
    // }).catch(err => {
    //     console.log(err);
    // });
}

module.exports = {
    getAlertscheduleByID,
    addAlertschedule,
    updateAlertschedulebyID,
    deleteAlertschedulebyID
}
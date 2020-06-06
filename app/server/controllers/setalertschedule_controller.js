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

const getAlerSchedulerList = (userId) => {
    let query = "SELECT alert_sch.*,alert_master.*,l.Location,d.Name as DataSouceName,l.DataSourceId FROM alertschedule AS alert_sch " +
        "INNER JOIN alertmaster as alert_master ON alert_master.AlertId = alert_sch.Id "+
        "INNER JOIN links as l ON l.NodeId = alert_sch.NodeId " + 
        "LEFT JOIN datasources d on d.Id=l.DataSourceId ";
    if (userId)
        query += ' where alert_sch.UserId=' + userId + ' and alert_master.CreatedBy =' + userId;
    return Alertschedule.raw(query);
}

module.exports = {
    getAlertscheduleByID,
    addAlertschedule,
    updateAlertschedulebyID,
    deleteAlertschedulebyID,
    getAlerSchedulerList
}
'use strict'

const { Tests } = require('../models')

const {
    createError,
    BAD_REQUEST,
    UNAUTHORIZED
} = require('../helpers/error_helper')


const getTestsByID = (id) => {
    return Tests.find({ Id: id });
    //return Tests.findAll();
}

const addTests = (data) => {
    return Tests.create(data)
    // .then(data => {
    //     console.log(data);
    // }).catch(err => {
    //     console.log(err);
    // });
}

const updateTestsbyid = (id, data) => {
    return Tests.update({ Id: id }, data);
    // .then(data => {
    //     console.log(data);
    // }).catch(err => {
    //     console.log(err);
    // });
}

const deleteTestsbyid = (nodeId) => {
    return Tests.destroy({ Id: nodeId })
    // .then(data => {
    //     console.log(data);
    // }).catch(err => {
    //     console.log(err);
    // });
}

const getTimelineChartData = (userId) => {
    let query = "Select x.*,c.Name as ChannelName,t.TeamName,l.Code as LocaleCode FROM ( " +
        "SELECT Id,TeamId, ChannelId,LocaleId,TestsDate as Date,IsDidTestWin,0 as IsAnalysis,CreatedBy FROM tests UNION " +
        "SELECT Id,TeamId, ChannelId,LocaleId,AnalysisDate as Date,0 as IsDidTestWin,1 as IsAnalysis,CreatedBy FROM analysis ) as x " +
        "left join channels c on c.Id=x.ChannelId " +
        "left join teams t on t.TeamId=x.TeamId " +
        "left join locales l on l.Id=x.LocaleId "
    if (userId)
        query += ' where x.CreatedBy=' + userId;

    return Tests.raw(query);
}
module.exports = {
    getTestsByID,
    addTests,
    updateTestsbyid,
    deleteTestsbyid,
    getTimelineChartData
}
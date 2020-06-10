'use strict'
const { Slack } = require('../models')
const {
    createError,
    BAD_REQUEST,
    UNAUTHORIZED
} = require('../helpers/error_helper')

const getSlackByAppID = (appId) => {
    return Slack.find({ AppID: appId });
}

const getSlackByUserID = (userId) => {
    return Slack.find({ CreatedBy: userId });
}

const addSlackApp = (data) => {
    return Slack.create(data);
}

const updateSlackMasterbyID = (id, data) => {
    return Slack.update({ Id: id }, data);
}

const getAllSlackList = () => {
    return Slack.findAll();
}

const getUserBySlackId = (slackID) => {
    return Slack.find({ SlackId: slackID });
}

module.exports = {
    getSlackByAppID,
    addSlackApp,
    updateSlackMasterbyID,
    getAllSlackList,
    getSlackByUserID,
    getUserBySlackId
}
'use strict'

const { Teams } = require('../models')

const {
    createError,
    BAD_REQUEST,
    UNAUTHORIZED
} = require('../helpers/error_helper')


const getTeamsByID = (id) => {
    return Teams.find({ TeamId: id });
}

const getTeamsList = () => {
    return Teams.findAll();
}

const addTeams = (data) => {
    return Teams.create(data)
}

const updateTeamsById = (data) => {
    return Teams.updateTeams(data.TeamId, data);
}

const deleteTeamsbyId = (TeamId) => {
    return Teams.destroy({ TeamId: TeamId })
}

module.exports = {
    getTeamsList,
    addTeams,
    getTeamsByID,
    updateTeamsById,
    deleteTeamsbyId
}
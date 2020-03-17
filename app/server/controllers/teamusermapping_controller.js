'use strict'

const { TeamUserMapping } = require('../models')
const {
    createError,
    BAD_REQUEST,
    UNAUTHORIZED
} = require('../helpers/error_helper')

const getTeamUserMapping = () => {   
    return TeamUserMapping.findAll();
}

const addTeamUserMapping = (data) => {
    return TeamUserMapping.create(data).then(data => {
        console.log(data);
    }).catch(err => {
        console.log(err);
    });
}

const addBulkTeamUserMapping = (data) => {
    return TeamUserMapping.bulkSave(data)    
}

const getTeamUserMappingByID = (id) => {
    return TeamUserMapping.find({ TeamId: id });    
}
const updateTeamUserMapping = (TeamIds, Data) => {
    return TeamUserMapping.destroy({ TeamId: TeamIds })   
}
const deleteTeamsUserMapping = (TeamIds) => {
    return TeamUserMapping.destroy({ TeamId: TeamIds }) 
}
module.exports = {
    getTeamUserMapping,
    addTeamUserMapping,
    getTeamUserMappingByID,
    updateTeamUserMapping,
    deleteTeamsUserMapping,
    addBulkTeamUserMapping
}
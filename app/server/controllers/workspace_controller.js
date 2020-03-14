'use strict'

const { Workspace } = require('../models')
const {
    createError,
    BAD_REQUEST,
    UNAUTHORIZED
} = require('../helpers/error_helper')

// Add New Workspace
const addWorkspace = (data) => {
    return Workspace.create(data).catch(err => {
        console.log(err);
    });
}

// Update Workspace by id
const updateWorkspaceById = (workspaceid, data) => {
    debugger;
    return Workspace.update({ Id: workspaceid }, data).catch(err => {
        console.log(err);
    });
}

// Get Workspace by UserId
const getWorkspaceUsersById = (id) => {
    return Workspace.find({ CreatedBy: id }).catch(err => {
        console.log(err);
    });
}

module.exports = {
    addWorkspace,
    getWorkspaceUsersById,
    updateWorkspaceById
}


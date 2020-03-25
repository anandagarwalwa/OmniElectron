'use strict'

const { Links } = require('../models')

const {
    createError,
    BAD_REQUEST,
    UNAUTHORIZED
} = require('../helpers/error_helper')


const getLinksByID = (id) => {
    return Links.find({ Id: id });
}

const getLinks = () => {
    return Links.findAll();
}

const getLinksByCreatedBy = (userId) => {
    if (userId)
        return Links.find({ CreatedBy: userId });
    else
        return Links.findAll();
}

const addLinks = (data) => {
    return Links.create(data)
        .then(data => {
            console.log(data);
        }).catch(err => {
            console.log(err);
        });
}

const updateLinksbyid = (id, data) => {
    return Links.update({ Id: id }, data);
}

const deleteLinksbyid = (nodeId) => {
    return Links.destroy({ Id: nodeId })
}

module.exports = {
    getLinksByID,
    addLinks,
    updateLinksbyid,
    deleteLinksbyid,
    getLinks,
    getLinksByCreatedBy
}
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

const getLinksForExplor = (userId) => {
    let query = 'select l.*,nFrom.Description as LinksFromDesc,nTo.Description as LinksToDesc from links l ' +
        ' left join nodes nFrom on nFrom.Id = l.LinksFrom ' +
        ' left join nodes nTo on nTo.Id = l.LinksTo';
    if (userId)
        query += ' where CreatedBy=' + userId;
    return Links.raw(query);
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
    getLinksForExplor
}
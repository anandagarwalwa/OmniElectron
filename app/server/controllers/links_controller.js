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
    let query = "select l.*,nFrom.Description as LinksFromDesc,nTo.Description as LinksToDesc, " +
        " c.Color as ChannelColor,ds.Color as DataToolColor,'#f88317' as TeamColor, nSelf.Description as NodeSourceDesc  " +
        " from links l " +
        " left join nodes nFrom on nFrom.Id = l.LinksFrom " +
        " left join nodes nTo on nTo.Id = l.LinksTo " +
        " left join channels c on c.Id=l.ChannelId " +
        " left join datasources ds on ds.Id=l.datasourceId " +
        " left join nodes nSelf on nSelf.Id = l.NodeId ";
    if (userId)
        query += ' where l.CreatedBy=' + userId;
    return Links.raw(query);
}

const addLinks = (data) => {
    return Links.create(data);
}

const updateLinksbyid = (id, data) => {
    return Links.update({ Id: id }, data);
}

const deleteLinksbyid = (nodeId) => {
    return Links.destroy({ Id: nodeId })
}

const getDataconfigLink = (datasourceId) => {
    let query = "SELECT * FROM datasourcedbconfig WHERE DatasourceId =" + datasourceId;
    return Links.raw(query);
}

module.exports = {
    getLinksByID,
    addLinks,
    updateLinksbyid,
    deleteLinksbyid,
    getLinks,
    getLinksForExplor,
    getDataconfigLink
}
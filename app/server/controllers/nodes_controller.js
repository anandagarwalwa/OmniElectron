'use strict'

const { Nodes } = require('../models')

const {
    createError,
    BAD_REQUEST,
    UNAUTHORIZED
} = require('../helpers/error_helper')


const getNodes = () => {
    return Nodes.findAll();
}

const getNodesByDataCategoryId = (dataCategoryId, userId) => {
    if (userId)
        return Nodes.find({ DataCategoryId: dataCategoryId, CreatedBy: userId });
    else
        return Nodes.find({ DataCategoryId: dataCategoryId });
}

const getNodesByID = (id) => {
    return Nodes.find({ Id: id });
}


const addNodes = (data) => {
    return Nodes.create(data)
}

const updateNodesbyid = (id, data) => {
    return Nodes.update({ Id: id }, data);
}

const deleteNodesbyid = (nodeId) => {
    return Nodes.destroy({ Id: nodeId })
}

const getNodeFilterData = (nodeid) => {
    let query = "SELECT n.Description AS nDescription, u.FirstName AS uFirstname, u.LastName AS uLastName, u.Photo AS uUserImage, " +
        "c.Name AS cChannelName, t.TeamName AS tTeamName, d.Name AS dDatasource , l.Description AS lLinkDescription, " +
        "l.CodeLink AS lCodeLink, l.ReportLink AS lReportLink, l.Tag AS lTags, l.Location AS Location FROM nodes AS n " +
        "INNER JOIN users AS u ON n.Owner = u.UserId " +
        "INNER JOIN links AS l ON n.Id = l.NodeId " +
        "INNER JOIN datasources AS d ON l.DataSourceId = d.Id " +
        "INNER JOIN teams AS t ON l.TeamId = t.TeamId " +
        "INNER JOIN channels AS c ON l.ChannelId = c.Id " +
        "WHERE n.Id =" + nodeid;
    return Nodes.raw(query);
}

module.exports = {
    getNodes,
    getNodesByID,
    addNodes,
    updateNodesbyid,
    deleteNodesbyid,
    getNodesByDataCategoryId,
    getNodeFilterData
}
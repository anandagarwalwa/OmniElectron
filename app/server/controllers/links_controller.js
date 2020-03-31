'use strict'

const { Links } = require('../models')

const {
    createError,
    BAD_REQUEST,
    UNAUTHORIZED
} = require('../helpers/error_helper')


const getLinksByID = (id) => {
    return Links.find({ Id: id });
    //return Links.findAll();
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
    debugger;
    return Links.create(data)
    .then(data => {
        console.log(data);
    }).catch(err => {
        console.log(err);
    });
}

const updateLinksbyid = (id, data) => {
    return Links.update({ Id: id }, data);
    // .then(data => {
    //     console.log(data);
    // }).catch(err => {
    //     console.log(err);
    // });
}

const deleteLinksbyid = (nodeId) => {
    return Links.destroy({ Id: nodeId })
    // .then(data => {
    //     console.log(data);
    // }).catch(err => {
    //     console.log(err);
    // });
}

module.exports = {
    getLinksByID,
    addLinks,
    updateLinksbyid,
    deleteLinksbyid,
    getLinks
}
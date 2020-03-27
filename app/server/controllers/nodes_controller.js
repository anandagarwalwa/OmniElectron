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

module.exports = {
    getNodes,
    getNodesByID,
    addNodes,
    updateNodesbyid,
    deleteNodesbyid,
    getNodesByDataCategoryId
}
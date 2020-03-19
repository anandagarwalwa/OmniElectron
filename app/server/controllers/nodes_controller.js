'use strict'

const { Nodes } = require('../models')

const {
    createError,
    BAD_REQUEST,
    UNAUTHORIZED
} = require('../helpers/error_helper')


const getNodes = () => {
    // return Users.find({ UserId: 1});
    return Nodes.findAll();
}

const getNodesByDataCategoryId = (dataCategoryId) => {
    return Nodes.find({ DataCategoryId: dataCategoryId });
}

const getNodesByID = (id) => {
    return Nodes.find({ Id: id });
    //return Nodes.findAll();
}


const addNodes = (data) => {
    return Nodes.create(data)
    // .then(data => {
    //     console.log(data);
    // }).catch(err => {
    //     console.log(err);
    // });
}

const updateNodesbyid = (id, data) => {
    return Nodes.update({ Id: id }, data);
    // .then(data => {
    //     console.log(data);
    // }).catch(err => {
    //     console.log(err);
    // });
}

const deleteNodesbyid = (nodeId) => {
    return Nodes.destroy({ Id: nodeId })
    // .then(data => {
    //     console.log(data);
    // }).catch(err => {
    //     console.log(err);
    // });
}

module.exports = {
    getNodes,
    getNodesByID,
    addNodes,
    updateNodesbyid,
    deleteNodesbyid,
    getNodesByDataCategoryId
}
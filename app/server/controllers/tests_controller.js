'use strict'

const { Tests } = require('../models')

const {
    createError,
    BAD_REQUEST,
    UNAUTHORIZED
} = require('../helpers/error_helper')


const getTestsByID = (id) => {
    return Tests.find({ Id: id });
    //return Tests.findAll();
}


const addTests = (data) => {
    return Tests.create(data)
    // .then(data => {
    //     console.log(data);
    // }).catch(err => {
    //     console.log(err);
    // });
}

const updateTestsbyid = (id, data) => {
    return Tests.update({ Id: id }, data);
    // .then(data => {
    //     console.log(data);
    // }).catch(err => {
    //     console.log(err);
    // });
}

const deleteTestsbyid = (nodeId) => {
    return Tests.destroy({ Id: nodeId })
    // .then(data => {
    //     console.log(data);
    // }).catch(err => {
    //     console.log(err);
    // });
}

module.exports = {
    getTestsByID,
    addTests,
    updateTestsbyid,
    deleteTestsbyid
}
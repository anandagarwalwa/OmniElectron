'use strict'

const { Analysis } = require('../models')

const {
    createError,
    BAD_REQUEST,
    UNAUTHORIZED
} = require('../helpers/error_helper')


const getAnalysisByID = (id) => {
    return Analysis.find({ Id: id });
    //return Analysis.findAll();
}


const addAnalysis = (data) => {
    return Analysis.create(data)
    // .then(data => {
    //     console.log(data);
    // }).catch(err => {
    //     console.log(err);
    // });
}

const updateAnalysisbyid = (id, data) => {
    return Analysis.update({ Id: id }, data);
    // .then(data => {
    //     console.log(data);
    // }).catch(err => {
    //     console.log(err);
    // });
}

const deleteAnalysisbyid = (nodeId) => {
    return Analysis.destroy({ Id: nodeId })
    // .then(data => {
    //     console.log(data);
    // }).catch(err => {
    //     console.log(err);
    // });
}

module.exports = {
    getAnalysisByID,
    addAnalysis,
    updateAnalysisbyid,
    deleteAnalysisbyid
}
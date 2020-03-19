'use strict'

const { Locales } = require('../models')

const {
    createError,
    BAD_REQUEST,
    UNAUTHORIZED
} = require('../helpers/error_helper')


const getLocales = () => {
    // return Users.find({ UserId: 1});
    return Locales.findAll();
}


const getLocalesByID = (id) => {
    return Locales.find({ Id: id });
    //return Nodes.findAll();
}


const addLocales = (data) => {
    return Locales.create(data)
    // .then(data => {
    //     console.log(data);
    // }).catch(err => {
    //     console.log(err);
    // });
}

const updateLocalesbyid = (id, data) => {
    return Locales.update({ Id: id }, data);
    // .then(data => {
    //     console.log(data);
    // }).catch(err => {
    //     console.log(err);
    // });
}

const deleteLocalesbyid = (nodeId) => {
    return Locales.destroy({ Id: nodeId })
    // .then(data => {
    //     console.log(data);
    // }).catch(err => {
    //     console.log(err);
    // });
}

module.exports = {
    getLocales,
    getLocalesByID,
    addLocales,
    updateLocalesbyid,
    deleteLocalesbyid

}
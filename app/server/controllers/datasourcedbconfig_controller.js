'use strict'

const { DatasourceDBConfig } = require('../models')
const {
    createError,
    BAD_REQUEST,
    UNAUTHORIZED
} = require('../helpers/error_helper')


const deleteDatabaseDBConfigUser = (id) => {
    return DatasourceDBConfig.destroy({ Id: id });
}

const getDatabaseDBConfigUsersById = (id) => {
    return DatasourceDBConfig.find({ Id: id }).catch(err => {
        console.log(err);
    });
}
const getDatasourceDBConfig = () => {
    return DatasourceDBConfig.findAll();
}
const addDatasourceDBConfig = (data) => {
    debugger
    return DatasourceDBConfig.create(data);
}
const updateDatasourceDBConfigUserById = (userid, data) => {
    return DatasourceDBConfig.update({ Id: userid }, data);
}

const getConfigDataSourceDB = (id) => {
    debugger;
    let query = "SELECT dsc.Id, dsc.DatasourceId, dsc.Host, dsc.Port, dsc.UserName, dsc.Password, " +
        "dsc.DatabaseName, dsc.ConfigName, dsc.CreatedDate, dsc.CreatedBy, " +
        "dsc.IsActive, dsc.Location, ds.Name AS DataSourceName FROM datasourcedbconfig AS dsc " +
        "INNER JOIN datasources AS ds ON dsc.DatasourceId = ds.Id " +
        "WHERE dsc.Id = " + id
    return DatasourceDBConfig.raw(query);
}

module.exports = {
    getDatasourceDBConfig,
    addDatasourceDBConfig,
    updateDatasourceDBConfigUserById,
    getDatabaseDBConfigUsersById,
    deleteDatabaseDBConfigUser,
    getConfigDataSourceDB
}
'use strict'

const createGuts = require('../helpers/model-guts')

const name = 'DatasourceDBConfig'
const tableName = 'datasourcedbconfig'

const selectableProps = [
    'Id',
    'DataSourceId',
    'Host',
    'Port',
    'UserName',
    'Password',
    'DatabaseName',
    'ConfigName',
    'CreatedBy',
    'CreatedDate',
    'IsActive'
] 

module.exports = knex => {
    const guts = createGuts({
        knex,
        name,
        tableName,
        selectableProps
    })

    return {
        ...guts
    }
}
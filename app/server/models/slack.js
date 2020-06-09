'use strict'

const createGuts = require('../helpers/model-guts')

const name = 'Slack'
const tableName = 'slack'

const selectableProps = [
    'Id',
    'AppID',
    'AuthToken',
    'AppName',
    'CreatedBy',
    'CreatedDate',
    'UpdatedDate',
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
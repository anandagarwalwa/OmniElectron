'use strict'

const createGuts = require('../helpers/model-guts')

const name = 'LogsDetails'
const tableName = 'logsdetails'

const selectableProps = [
    'Id',
    'LogsMessage',
    'CreatedBy',
    'CreatedDate',
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
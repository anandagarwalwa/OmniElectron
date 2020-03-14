'use strict'

const createGuts = require('../helpers/model-guts')

const name = 'Workspace'
const tableName = 'workspace'

const selectableProps = [
    'Id',
    'Name',
    'Domain',
    'CreatedBy',
    'CreatedDate'
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
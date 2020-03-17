'use strict'

const createGuts = require('../helpers/model-guts')

const name = 'Nodes'
const tableName = 'nodes'

const selectableProps = [
    'Id',
    'Description',
    'Owner',
    'DataCategoryId',
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
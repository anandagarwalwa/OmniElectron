'use strict'

const createGuts = require('../helpers/model-guts')

const name = 'Datasources'
const tableName = 'datasources'

const selectableProps = [
    'Id',
    'Name',
    'Color'
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
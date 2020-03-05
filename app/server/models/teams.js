'use strict'

const createGuts = require('../helpers/model-guts')

const name = 'Teams'
const tableName = 'teams'

const selectableProps = [
    'TeamId',
    'TeamName',
    'Description',
    'IsActive',
    'CreatedBy',
    'CreatedDate',
    'UpdatedBy',
    'UpdatedDate'
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
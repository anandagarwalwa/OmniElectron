'use strict'

const createGuts = require('../helpers/model-guts')

const name = 'TeamUserMapping'
const tableName = 'teamusermapping'

const selectableProps = [
    'TeamId',
    'UserId',
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
'use strict'

const createGuts = require('../helpers/model-guts')

const name = 'Channels'
const tableName = 'channels'

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
'use strict'

const createGuts = require('../helpers/model-guts')

const name = 'Locales'
const tableName = 'locales'

const selectableProps = [
    'Id',
    'Name',
    'Code'
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
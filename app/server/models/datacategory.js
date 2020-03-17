'use strict'

const createGuts = require('../helpers/model-guts')

const name = 'Datacategory'
const tableName = 'datacategory'

const selectableProps = [
    'Id',
    'Name',
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
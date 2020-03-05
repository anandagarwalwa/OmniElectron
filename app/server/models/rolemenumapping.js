'use strict'

const createGuts = require('../helpers/model-guts')

const name = 'Rolemenumapping'
const tableName = 'rolemenumapping'

const selectableProps = [
    'Id',
    'RoleId',
    'MenuId',
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
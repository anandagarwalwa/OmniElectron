'use strict'

const createGuts = require('../helpers/model-guts')

const name = 'Roles'
const tableName = 'roles'

const selectableProps = [
    'RoleId',
    'RoleName',
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
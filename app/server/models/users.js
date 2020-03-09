'use strict'

const createGuts = require('../helpers/model-guts')

const name = 'Users'
const tableName = 'users'

const selectableProps = [
    'UserId',
    'FirstName',
    'LastName',
    'EmailId',
    'Photo',
    'Domain',
    'CreatedBy',
    'CreatedDate',
    'UpdatedBy',
    'UpdatedDate',
    'IsActive',
    'RoleId'
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
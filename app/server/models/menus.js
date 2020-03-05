'use strict'

const createGuts = require('../helpers/model-guts')

const name = 'Menus'
const tableName = 'menus'

const selectableProps = [
    'MenuId',
    'MenuLevel',
    'ParentId',
    'DisplayOrder',
    'MenuText',
    'Description',
    'IsParent',
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
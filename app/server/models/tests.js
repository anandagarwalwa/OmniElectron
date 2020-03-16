'use strict'

const createGuts = require('../helpers/model-guts')

const name = 'Tests'
const tableName = 'tests'

const selectableProps = [
    'Id',
    'Description',
    'IsDidTestWin',
    'Owner',
    'TeamId',
    'ChannelId',
    'LocaleId',
    'TestsDate',
    'IsConfluencePage',
    'CreatedBy',
    'CreatedDate',
    'NodeId',
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
'use strict'

const createGuts = require('../helpers/model-guts')

const name = 'Links'
const tableName = 'links'

const selectableProps = [
    'Id',
    'Description',
    'Owner',
    'TeamId',
    'DataSourceId',
    'Location',
    'ChannelId',
    'LinksTo',
    'LinksFrom',
    'IsConfluencePage',
    'NodeId',
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
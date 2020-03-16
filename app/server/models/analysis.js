'use strict'

const createGuts = require('../helpers/model-guts')

const name = 'Analysis'
const tableName = 'analysis'

const selectableProps = [
    'Id',
    'Owener',
    'TeamId',
    'ChannelId',
    'LocaleId',
    'AnalysisDate',
    'IsConfluencePage',
    'CreatedBy',
    'CreateDate',
    'NodeId'
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
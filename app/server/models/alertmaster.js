'use strict'

const createGuts = require('../helpers/model-guts')

const name = 'AlertMaster'
const tableName = 'alertmaster'

const selectableProps = [
    'Id',
    'Description',
    'NodeId',
    'DataSourceId',
    'SubDataSourceName',
    'NotificationType',
    'Recipieants',
    'EmailBody',
    'IsIncludeData',
    'NotifyTimeFrameFrom',
    'NotifyTimeFrameTo',
    'CreatedBy',
    'CreatedDate',
    'NextScheduleDate',
    'EmailTitle'
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
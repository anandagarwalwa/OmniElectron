'use strict'

const createGuts = require('../helpers/model-guts')

const name = 'Alertschedule'
const tableName = 'alertschedule'

const selectableProps = [
    'Id',
    'UserId',
    'NodeId',
    'SetAlertTo',
    'Granularity',
    'TimeframeFrom',
    'TimeframeTo',
    'AlertToMetric',
    'MetricCriteria',
    'MetricValue',
    'AlertFilter',
    'FilterCriteria',
    'FilterValue',
    'CreatedDate',
    'DateRun',
    'AlertFailure'
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
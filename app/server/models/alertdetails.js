'use strict'

const createGuts = require('../helpers/model-guts')

const name = 'AlertDetail'
const tableName = 'alertdetail'

const selectableProps = [
    'Id',
    'AlertId',
    'AlertTo',
    'Granuality',
    'TimeFrameFrom',
    'TimeFrameTo',
    'MetricTo',
    'MetricCondition',
    'MetricValue',
    'FilterTo',
    'FilterCondition',
    'FilterValue'
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
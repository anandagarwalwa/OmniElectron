'use strict'

// The guts of a model that uses Knexjs to store and retrieve data from a
// database using the provided `knex` instance. Custom functionality can be
// composed on top of this set of common guts.
//
// The idea is that these are the most-used types of functions that most/all
// "models" will want to have. They can be overriden/modified/extended if
// needed by composing a new object out of the one returned by this function ;)
module.exports = ({
  knex = {},
  name = 'name',
  tableName = 'tablename',
  selectableProps = [],
  timeout = 1000
}) => {
  const create = props => {
    delete props.id // not allowed to set `id`

    return knex.insert(props)
      .returning(selectableProps)
      .into(tableName)
      .timeout(timeout)
  }

  const findAll = () => knex.select(selectableProps)
    .from(tableName)
    .timeout(timeout)

  const find = filters => knex.select(selectableProps)
    .from(tableName)
    .where(filters)
    .timeout(timeout)

  // Same as `find` but only returns the first match if >1 are found.
  const findOne = filters => find(filters)
    .then(results => {
      if (!Array.isArray(results)) return results

      return results[0]
    })

  const findById = id => knex.select(selectableProps)
    .from(tableName)
    .where({ id })
    .timeout(timeout)

  const update = (updateProps, props) => {
    if (props.UserId)
      delete props.UserId // not allowed to set `id`

    return knex.update(props)
      .from(tableName)
      .where(updateProps)
      .returning(selectableProps)
      .timeout(timeout)
  }
  const destroy = props => knex.del()
    .from(tableName)
    .where(props)
    .timeout(timeout)

  const bulkSave = rows => {
    for (var props in rows) {
      if (props.id)
        delete props.id // not allowed to set `id`
    }

    return knex.insert(rows)
      .returning(selectableProps)
      .into(tableName)
      .timeout(timeout)
  }
  const updateTeams = (TeamId, props) => {
    if (props.TeamId)
      delete props.TeamId // not allowed to set `id`

    return knex.update(props)
      .from(tableName)
      .where({ TeamId })
      .returning(selectableProps)
      .timeout(timeout)
  }

  const findDistinct = () => knex.distinct(selectableProps)
    .from(tableName)
    .timeout(timeout)

  const raw = query => knex.raw(query)
  return {
    name,
    tableName,
    selectableProps,
    timeout,
    create,
    findAll,
    find,
    findOne,
    findById,
    update,
    destroy,
    bulkSave,
    updateTeams,
    findDistinct,
    raw
  }
}

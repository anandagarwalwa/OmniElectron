'use strict'

const { Users } = require('../models')
const {
    createError,
    BAD_REQUEST,
    UNAUTHORIZED
} = require('../helpers/error_helper')

const getUsers = () => {
    // return Users.find({ UserId: 1});
    return Users.findAll();
}

const addUser = (data) => {
    return Users.create(data);
    // .then(data => {
    //     console.log(data);
    // }).catch(err => {
    //     console.log(err);
    // });
}

const deleteUser = (id) => {
    return Users.destroy({ UserId: id });
    // .then(data => {
    //     console.log(data);
    // }).catch(err => {
    //     console.log(err);
    // });
}

const userLogin = (data) => {
    return Users.findOne(data).catch(err => {
        console.log(err);
    });
}

const getUsersById = (id) => {
    return Users.find({ UserId: id }).catch(err => {
        console.log(err);
    });
}

const updateUserById = (userid, data) => {
    return Users.update({ UserId: userid }, data);
}

const insertOrUpdate = (tableName, rows) => {
    return DB.transaction((trx) => {
        const queries = rows.map((tuple) => {
            const insert = trx(tableName).insert(tuple).toString()
            const update = trx(tableName).update(tuple).toString().replace(/^update(.*?)set\s/gi, '')
            return trx.raw(`${insert} ON CONFLICT ${update}`).transacting(trx)
        })
        return Promise.all(queries).then(trx.commit).catch(trx.rollback)
    })
}

module.exports = {
    getUsers
    , addUser, userLogin, getUsersById, updateUserById,insertOrUpdate, deleteUser
}


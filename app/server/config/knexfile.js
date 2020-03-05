'use strict'

// ref: https://devhints.io/knex
// TODO: implement more dynamic env var settings loader
module.exports = {
    development: {
        client: 'mysql',
        connection: {
            host: '192.168.0.14',
            port: '3306',
            user: 'root',
            password: 'admin123!@#',
            database: 'workspacedb'
        }
    },
    production: {
        client: 'postgresql',
        connection: {
            database: 'my_db',
            user: 'username',
            password: 'password'
        },
        pool: {
            min: 2,
            max: 10
        },
        migrations: {
            tableName: 'knex_migrations'
        }
    }
}
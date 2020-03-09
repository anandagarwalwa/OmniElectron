'use strict'
const fs = require('fs')
const path = require('path')
const knex = require('../config/database')

const getModelFiles = dir => fs.readdirSync(dir)
    .filter(file => (file.indexOf('.') !== 0) && (file !== 'index.js'))
    .map(file => path.join(dir, file))

// Gather up all model files (i.e., any file present in the current directory
// that is not this file) and export them as properties of an object such that
// they may be imported using destructuring like
// `const { MyModel } = require('./models')` where there is a model named
// `MyModel` present in the exported object of gathered models.
// const files = getModelFiles(__dirname)
const modelpath = __dirname.indexOf('server\\models') > -1 ? __dirname : (__dirname + '\\server\\models')
const files = getModelFiles(`${modelpath}`)
const models = files.reduce((modelsObj, filename) => {
    const fNameArr = filename.split('\\');
    const fName = './' + fNameArr[fNameArr.length - 1];
    var initModel = require(`${fName}`);
    var model = initModel(knex);

    if (model) modelsObj[model.name] = model

    return modelsObj
}, {})

module.exports = models
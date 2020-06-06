'use strict'

const { LogsDetails } = require('../models')

const {
    createError,
    BAD_REQUEST,
    UNAUTHORIZED
} = require('../helpers/error_helper')

const addLogsDetails = (data) => {
    return LogsDetails.create(data)
    // .then(data => {
    //     console.log(data);
    // }).catch(err => {
    //     console.log(err);
    // });
}

const getLogsDetails=()=>{
    let query ="select l.*,u.FirstName as FirstName ,u.LastName as LastName,u.Photo as Photo,u.CreatedDate as userCreatedDate from  logsdetails l inner join users u on u.UserId=l.CreatedBy order by Id desc  ";    
    return LogsDetails.raw(query);
}

const deleteLogsDetails = (id) => {
    return LogsDetails.destroy({ Id: id });
}
module.exports = {
    addLogsDetails,
    getLogsDetails,
    deleteLogsDetails
}
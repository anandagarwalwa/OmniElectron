'use strict'

const { Teams, TeamUserMapping } = require('../models')

const {
    createError,
    BAD_REQUEST,
    UNAUTHORIZED
} = require('../helpers/error_helper')


const GetTeamsByID = (id) => {
    return Teams.find({ TeamId: id });
    //return Teams.findAll();
}

const GetTeamsList = () => {
    // return Users.find({ UserId: 1});
    return Teams.findAll();
}

const addTeams = (data) => {
    return Teams.create(data)
    // .then(data => {
    //     console.log(data);
    // }).catch(err => {
    //     console.log(err);
    // });
}

const UpdateTeamsbyid = (data) => {
    return Teams.updateTeams(data.TeamId, data);
    // .then(data => {
    //     console.log(data);
    // }).catch(err => {
    //     console.log(err);
    // });
}

const DeleteTeamsbyid = (TeamId) => {
    return Teams.destroy({ TeamId: TeamId })
    // .then(data => {
    //     console.log(data);
    // }).catch(err => {
    //     console.log(err);
    // });
}

const AddTeamusermapping = (data) => {
    return TeamUserMapping.bulkSave(data)
    // .then(ResponseData => {
    //     debugger;
    //     console.log(ResponseData);
    // })
    // .catch(err => {
    //     console.log(err);
    // });
}
const GetTeamusermappingByID = (id) => {
    return TeamUserMapping.find({ TeamId: id });
    // .then(ResponseData => {
    //     debugger;
    //     console.log(ResponseData);
    // })
    // .catch(err => {
    //     console.log(err);
    // });
}
const UpdateTeamusermapping = (TeamIds, Data) => {
    return TeamUserMapping.destroy({ TeamId: TeamIds })
    //.then(ResponseData => {
    //     debugger;
    //     return Teamusermapping.bulkSave(Data)
    // }).catch(err => {
    //     console.log(err);
    // });

}
const deleteTeamsUserMapping = (TeamIds) => {
    return TeamUserMapping.destroy({ TeamId: TeamIds })
    //.then(ResponseData => {
    //     debugger;
    //     return Teamusermapping.bulkSave(Data)
    // }).catch(err => {
    //     console.log(err);
    // });

}
module.exports = {
    GetTeamsList,
    addTeams,
    AddTeamusermapping,
    GetTeamsByID,
    GetTeamusermappingByID,
    UpdateTeamsbyid,
    UpdateTeamusermapping,
    deleteTeamsUserMapping,
    DeleteTeamsbyid
}
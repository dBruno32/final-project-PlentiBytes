// One User has One Schedule (For Now)
// One Schedule has Many Goals
// One Schedule hass Many Entries

const Sequelize = require('sequelize');
const db = require('../utils/db');


const Goal = db.define('goal', {
    id: {
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
    },
    goalAmount: {
        type: Sequelize.INTEGER
    },
    goalType: {
        type: Sequelize.STRING 
    },
    day: {
        type: Sequelize.STRING
    },
    schedule: {                 // Pending: 'schedule' : schedule ID
        type: Sequelize.INTEGER
    },
    createdAt: {
        type: Sequelize.DATE,
        default: Date.now
    },
    updatedAt: {
        type: Sequelize.DATE
    }
});

Goal.sync().then(() => {
    console.log(`goals table updated....`);
});

module.exports = Goal;

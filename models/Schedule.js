// One User has One Schedule (For Now)
// One Schedule has Many Goals
// One Schedule hass Many Entries

const Sequelize = require('sequelize');
const db = require('../utils/db');


const Schedule = db.define('schedule', {
    id: {
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
    },
    title: {
        type: Sequelize.STRING
    },
    owner: {
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

Schedule.sync().then(() => {
    console.log(`Schedules table updated....`);
});

module.exports = Schedule;

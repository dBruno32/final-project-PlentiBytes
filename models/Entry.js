// One User has One Schedule (For Now)
// One Schedule has Many Goals
// One Schedule hass Many Entries

const Sequelize = require('sequelize');
const db = require('../utils/db');


const Entry = db.define('entry', {
    id: {
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
    },
    entryType: {
        type: Sequelize.STRING
    },
    entryAmount: {
        type: Sequelize.INTEGER
    },
    day: {
        type: Sequelize.INTEGER
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

Entry.sync().then(() => {
    console.log(`Entries table updated....`);
});

module.exports = Entry;

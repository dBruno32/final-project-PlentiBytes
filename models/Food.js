// One User has One Schedule (For Now)
// One Schedule has Many Goals
// One Schedule hass Many Entries

const Sequelize = require('sequelize');
const db = require('../utils/db');


const Goal = db.define('food', {
    id: {
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
    },
    goalType: {
        type: Sequelize.STRING
    },
    servingSize: {
        type: Sequelize.INTEGER
    },
    servingCalorie: {
        type: Sequelize.INTEGER
    },
    servingCarbohydrate: {                
        type: Sequelize.INTEGER
    },
    servingFat: {                
        type: Sequelize.INTEGER
    },
    servingFiber: {                
        type: Sequelize.INTEGER
    },
    servingProtein: {                
        type: Sequelize.INTEGER
    },
    servingSugar: {                
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
    console.log(`Goals table updated....`);
});

module.exports = Goal;

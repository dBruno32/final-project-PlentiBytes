const Sequelize = require('sequelize');
const db = require('../utils/db');


const User = db.define('user', {
    id: {
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
    },
    displayName: {
        type: Sequelize.STRING
    },
    password: {
        type: Sequelize.STRING
    },
    email: {
        type: Sequelize.STRING
    },
    createdAt: {
        type: Sequelize.DATE,
        default: Date.now
    },
    updatedAt: {
        type: Sequelize.DATE
    }
});

User.sync().then(() => {
    console.log(`users table updated....`);
});

module.exports = User;

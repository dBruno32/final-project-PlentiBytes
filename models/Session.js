const Sequelize = require('sequelize');
 
const sequelize = require('../utils/db');
 
  const mapping = {
    sid: {
      type: Sequelize.STRING,
      primaryKey: true,
    },
    expires: Sequelize.DATE,
    data: Sequelize.STRING(50000),
  };
 
  const Session = sequelize.define('sessions', mapping, {
    indexes: [
      {
        name: 'session_sid_index',
        method: 'BTREE',
        fields: ['sid']
      },
    ],
  });
 
  exports.getMapping = () => mapping;
 
  exports.getModel = () => Session;

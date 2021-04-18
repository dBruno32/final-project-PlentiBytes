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
    sid: {
      type: Sequelize.STRING,
      primaryKey: true,
    },
    expires: Sequelize.DATE,
    data: Sequelize.STRING(50000),
  });
 
  exports.getMapping = () => mapping;
 
  exports.getModel = () => Session;

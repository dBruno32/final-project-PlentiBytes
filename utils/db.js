const Sequelize = require('sequelize');
const pg = require('pg');
pg.defaults.ssl = true;

const { sqlDB, sqlUSR, sqlPW, sqlH } = require('../config');


module.exports = new Sequelize(sqlDB, sqlUSR, sqlPW, {
    host: sqlH,
    port: 5432,
    dialect: 'postgres',
    ssl: true,
    operatorsAliases: false,
    dialectOptions: {
        encrypt: true,
        ssl: {
          require: true,
          rejectUnauthorized: false 
          
        }
      },
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
},
console.log(sqlDB));

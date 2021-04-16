const dotenv = require('dotenv');
dotenv.config({ path: './utils/config.env'});
module.exports = {
  port: process.env.PORT,
  sqlUSR: process.env.SQL_USR,
  sqlDB: process.env.SQL_DB,
  sqlPW: process.env.SQL_PW,
  sqlH: process.env.SQL_H,
  passKey: process.env.PASS_KEY
};
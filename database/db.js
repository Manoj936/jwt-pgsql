const pgp = require("pg-promise")();
require("dotenv").config();
//configs
const db = pgp(
  `postgres://${process.env.user}:${process.env.password}@${process.env.host}:${process.env.port}/${process.env.database}`
);
// checking connection
db.connect()
  .then(function (obj) {
    obj.done();
    console.log("db is connected:", obj.client._connected);
  })
  .catch(function (error) {
    console.log("ERROR:", error.message);
  });
module.exports = db;

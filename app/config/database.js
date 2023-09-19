var sql = require('mysql');

var configuration ={
    host:process.env.DATABASE_HOSTNAME,
    user:process.env.DATABASE_USER,
    password:process.env.DATABASE_PASSWORD,
    database:process.env.DATABASE_NAME
}

var connection = sql.createPool(configuration)

module.exports = connection;
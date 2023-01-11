const mysql = require('mysql');
const{promisify} = require('util')
const {database}= require('./keys')

const pool = mysql.createPool(database);

pool.getConnection((err, conn)=>{
    if(err){
        if(err.code === 'PROTOCOL_CONNECTION_LOST') {
            console.log('DATABASE CONNECTION WAS CLOSED');
        }
        if(err.code === 'ER_CON_COUNT_ERROR') {
            console.log('DATABASE HAS TO MANY CONNECTIONS');
        }
        if(err.code === 'ECONNERFUSED') {
            console.log('DATABASE CONNECTION WAS REFUSED');
        }
    }
    if(conn)conn.release();
    console.log('DB is Connected');
    return;

})
pool.query = promisify(pool.query);

module.exports = pool
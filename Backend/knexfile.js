const development = {
  client: 'mysql',
  connection: {
    host : process.env.DB_HOST,
    user : process.env.DB_USER,
    password : process.env.DB_PASS,
    database : process.env.DB_NAME
  },
  pool: {
    max: (process.env.DB_MAX_POOL)?parseInt(process.env.DB_MAX_POOL):5000,
    min: 1
  },
}
/*  
const Firebird = require('node-firebird');
var options = {};

options.host = 'nouveau-erp.c.personalsoft.com.br';
options.port = 3050;
options.database = 'nouveau';
options.user = 'PSILLISP';
options.password = 'lisppsil';
options.lowercase_keys = false; // set to true to lowercase keys
options.role = 'PUBLICO';            // default
options.pageSize = 4096;        // default when creating database

var bancoexterno = Firebird.pool(5000, options);
*/
console.log("conectando banco local", development )
//console.log("conectando banco externo firebird",  bancoexterno)


exports.development = development;
//exports.bancoexterno = bancoexterno;
const envConfig = require('../knexfile').development;
const envConfig2 = require('../knexfile').bancoexterno;

console.info("db envConfig -->", envConfig + envConfig2)


//primeiro banco 
const knex_read_config = envConfig;
const knex_write_config = envConfig;
const knex_read = require('knex')(knex_read_config);
const knex_write = require('knex')(knex_write_config);


module.exports = {
    read: knex_read,
    write: knex_write,
    bancoexterno: envConfig2
    
};
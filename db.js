const { Pool } = require('pg');


// PostgreSQL connection pool
const pool = new Pool({
    user:"postgres",
    password:"admin",
    database:"leon_database",
    host:"localhost",
    port:5432
  });

module.exports=pool;
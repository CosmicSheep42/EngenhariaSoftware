// External imports
const { Pool } = require('pg');


const DatabasePool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: false,
    idleTimeoutMillis: Number(process.env.TIMEOUT),
});


module.exports = { DatabasePool };
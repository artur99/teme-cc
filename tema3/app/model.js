const crypto = require('crypto')
const mysql = require('promise-mysql')

// [START cloud_sql_mysql_mysql_create]
let pool;
const createPool = async () => {
  pool = await mysql.createPool({
    user: process.env.DB_USER, // e.g. 'my-db-user'
    password: process.env.DB_PASS, // e.g. 'my-db-password'
    database: process.env.DB_NAME, // e.g. 'my-database'
    // If connecting via unix domain socket, specify the path
    socketPath: `./cloudsql/${process.env.CLOUD_SQL_CONNECTION_NAME}`,
    // If connecting via TCP, enter the IP and port instead
    // host: 'localhost',
    // port: 3306,

    //[START_EXCLUDE]

    // [START cloud_sql_mysql_mysql_limit]
    // 'connectionLimit' is the maximum number of connections the pool is allowed
    // to keep at once.
    connectionLimit: 5,
    // [END cloud_sql_mysql_mysql_limit]

    // [START cloud_sql_mysql_mysql_timeout]
    // 'connectTimeout' is the maximum number of milliseconds before a timeout
    // occurs during the initial connection to the database.
    connectTimeout: 10000, // 10 seconds
    // 'acquireTimeout' is the maximum number of milliseconds to wait when
    // checking out a connection from the pool before a timeout error occurs.
    acquireTimeout: 10000, // 10 seconds
    // 'waitForConnections' determines the pool's action when no connections are
    // free. If true, the request will queued and a connection will be presented
    // when ready. If false, the pool will call back with an error.
    waitForConnections: true, // Default: true
    // 'queueLimit' is the maximum number of requests for connections the pool
    // will queue at once before returning an error. If 0, there is no limit.
    queueLimit: 0, // Default: 0
    // [END cloud_sql_mysql_mysql_timeout]

    // [START cloud_sql_mysql_mysql_backoff]
    // The mysql module automatically uses exponential delays between failed
    // connection attempts.
    // [END cloud_sql_mysql_mysql_backoff]

    //[END_EXCLUDE]
  });
};
// [END cloud_sql_mysql_mysql_create]


var initDB = async _ => {
    await createPool()
    return await pool.query(`
        CREATE TABLE IF NOT EXISTS users (
        	id INT NOT NULL AUTO_INCREMENT,
        	email VARCHAR(64) NOT NULL,
        	password VARCHAR(64) NOT NULL,
        	register_time date DEFAULT NULL,
        	login_time date DEFAULT NULL,
        	KEY user_email_idx (email) USING BTREE,
        	PRIMARY KEY (id)
        )`)
}

var login = async (email, pass) => {
    pass = encodePass(pass)

    var data = await pool.query(
        `SELECT id, email FROM users WHERE email = ? AND password = ? LIMIT 1`,
        [email, pass]
    )

    if(data.length < 1) return false
    return data[0]
}

var encodePass = pwd => crypto.createHash('sha256').update(pwd).digest('hex')

var emailExists = async (email) => {
    var data = await pool.query(`SELECT id, email FROM users WHERE email = ? LIMIT 1`, [email])

    return data.length > 0
}

var register = async (email, pass) => {
    pass = encodePass(pass)

    try {
        var insert_id = await pool.query(
            `INSERT INTO users(email, password, register_time, login_time)
            VALUES(?, ?, NOW(), NOW())`,
            [email, pass]
        )
    }
    catch(e) {
        console.log("Error registering user:", e)
        return false
    }

    return true
}

module.exports = {
    getPool: _ => pool,
    initDB: initDB,
    login: login,
    register: register,
    emailExists: emailExists,
}

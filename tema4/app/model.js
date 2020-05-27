const crypto = require('crypto')
const mysql = require('promise-mysql')
// const {Datastore} = require('@google-cloud/datastore');

const CONF = require('../config/config')

let pool;
const createPool = async () => {
    pool = await mysql.createPool({
        user: CONF.db_user,
        password: CONF.db_password,
        database: CONF.db_name,
        host: CONF.db_host,
        connectionLimit: 5,
        connectTimeout: 10000,
        acquireTimeout: 10000,
        waitForConnections: true,
        queueLimit: 0,
    });
};
// const datastore = new Datastore();



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


var addTask = async (user_id, description) => {
    const taskKey = datastore.key('Task')
    const task = {
        key: taskKey,
        data: {
            done: false,
            user_id: user_id,
            description: description,
        }
    }

    await datastore.save(task)

    return task
}

var markTask = async (user_id, task_id, done) => {
    var kk = datastore.key(['Task', parseInt(task_id)])
    if(!kk) return false

    const [entity] = await datastore.get(kk)

    entity.done = done

    var task = {
        key: kk,
        data: entity
    }

    await datastore.save(task)

    return task
}

var getTasks = async (user_id) => {
    var query = datastore.createQuery('Task').filter('user_id', '=', user_id)
    var [tasks] = await datastore.runQuery(query)

    for(let i in tasks) {
        tasks[i].id = tasks[i][datastore.KEY]
    }

    return tasks
}

module.exports = {
    getPool: _ => pool,
    initDB: initDB,
    login: login,
    register: register,
    emailExists: emailExists,
    addTask: addTask,
    markTask: markTask,
    getTasks: getTasks,
}

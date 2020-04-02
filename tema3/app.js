const express = require('express')
const session = require('express-session')
const model = require('./app/model')

const PORT = process.env.PORT || 8080;
const app = express()

app.use(express.json({ limit: "50mb"}))
app.use(express.urlencoded({ limit: "50mb", extended: true }))
app.use(session({
    secret: 't2yfuti7ey2uo1jlkkbhdgiuqowhijknljkbhdjgiyuqot8ywujlks',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: true }
}))

app.get('/', async (req, res) => {
    // const recentVotesQuery = await model.getPool().query('SELECT * FROM users');
    res.sendFile(__dirname + '/front/login.html')
})

app.get('/register', async (req, res) => {
    // const recentVotesQuery = await model.getPool().query('SELECT * FROM users');
    res.sendFile(__dirname + '/front/register.html')
})


app.post('/api/login', async (req, res) => {
    if(!req.body.email) return res.json({error: 'Missing email.'})
    if(!req.body.pass) return res.json({error: 'Missing password.'})

    var login_data = await model.login(req.body.email, req.body.pass)

    if(!login_data) return res.json({error: 'Wrong email or password.'})

    req.session.connected = true;
    req.session.id = login_data.id
    req.session.email = login_data.email

    res.json({success: 'Connected successfuly.'})
})

app.post('/api/register', async (req, res) => {
    if(!req.body.email) return res.json({error: 'Missing email.'})
    if(!req.body.pass) return res.json({error: 'Missing password.'})
    if(!req.body.cpass) return res.json({error: 'Missing password.'})
    if(req.body.pass.length < 6) return res.json({error: 'Password too short.'})
    if(req.body.pass != req.body.cpass) return res.json({error: 'Passwords don\'t match.'})

    if(await model.emailExists(req.body.email)) return res.json({error: 'Email already registered.'})

    var reg_data = await model.register(req.body.email, req.body.pass)
    if(!reg_data) return res.json({error: 'Registration failed, please try again later.'})

    res.json({success: 'Registered successfuly.'})
})


app.listen(PORT, async () => {
    console.log("Checking db...")
    await model.initDB()

    console.log(`App listening on port ${PORT}`);
});

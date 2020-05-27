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
    cookie: { secure: false }
}))

app.get('/', async (req, res) => {
    console.log(req.session)
    res.sendFile(__dirname + '/front/login.html')
})

app.get('/register', async (req, res) => {
    res.sendFile(__dirname + '/front/register.html')
})
app.get('/dash', async (req, res) => {
    if(!req.session.user_id) return res.redirect('/')
    res.sendFile(__dirname + '/front/tasks.html')
})


app.post('/api/logout', async (req, res) => {
    req.session.destroy()

    res.json({success: 'ok'})
})

app.post('/api/login', async (req, res) => {
    if(!req.body.email) return res.json({error: 'Missing email.'})
    if(!req.body.pass) return res.json({error: 'Missing password.'})

    var login_data = await model.login(req.body.email, req.body.pass)

    if(!login_data) return res.json({error: 'Wrong email or password.'})
    console.log(login_data)

    req.session.connected = true;
    req.session.user_id = login_data.id
    req.session.email = login_data.email

    req.session.save()

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

app.post('/api/get_tasks', async (req, res) => {
    if(!req.session.user_id) return res.json({error: 'You need to login.'})

    var tasks = await model.getTasks(req.session.user_id)

    res.json(tasks)
})

app.post('/api/add_task', async (req, res) => {
    if(!req.session.user_id) return res.json({error: 'You need to login.'})
    if(!req.body.description) return res.json({error: 'You need to provide a text for the task.'})

    var task_data = await model.addTask(req.session.user_id, req.body.description)

    if(!task_data) return res.json({error: 'Task could not be added.'})

    res.json({success: 'Task added.', task: task_data})
})

app.post('/api/mark_task', async (req, res) => {
    if(!req.session.user_id) return res.json({error: 'You need to login.'})
    if(!req.body.task_id) return res.json({error: 'You need to provide a task_id.'})
    if(!req.body.done) return res.json({error: 'You need to provide how to mark the task as.'})

    var task_data = await model.markTask(req.session.user_id, req.body.task_id, !!req.body.done)

    res.json({success: 'Modified.', task: task_data})
})


app.listen(PORT, async () => {
    console.log("Checking db...")
    await model.initDB()

    console.log(`App listening on port ${PORT}`);
});

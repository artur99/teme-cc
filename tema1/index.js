const express = require('express')

const model = require('./model/model')

const app = express()
const port = 3000

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/front/index.html')
})

app.get('/get_movie', (req, res) => {
    if(!req.query.email) {
        return res.json({error: 'Email not sent.'})
    }

    model.get_movie(req.query.email, function(err, data) {
        if(err) return res.json({error: err})

        res.json(data)
    })
})
app.get('/metrics', (req, res) => {
    res.header("Content-Type", 'application/json')
    res.send(JSON.stringify(model.get_metrics(), null, 4))
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

const express = require('express')
const datastore = require('nedb')

const db = new datastore({ filename: 'db/tasks.db', autoload: true });;
const app = express()
const port = 3000

app.use(express.json({ limit: "50mb"}))
app.use(express.urlencoded({ limit: "50mb", extended: true }))

app.all('/', (req, res) => {
    res.statusMessage = 'Method not allowed'
    res.status(405)
    res.json({error: 'Method not allowed. Please use one of the active routes.'})
})

app.get('/tasks', (req, res) => {
    db.find({}, function(err, docs) {
        if(err) {
            res.statusMessage = 'Server error'
            res.status(500)
            res.json({error: 'Error getting tasks: ' + err.message})
            return
        }

        res.json(docs)
    })
})

app.post('/tasks', (req, res) => {
    if(!req.body.title || !req.body.description) {
        res.statusMessage = 'Bad request'
        res.status(400)
        res.json({success: 'Missing title or description, please include them in body.'})
        return
    }

    db.insert({ title: req.body.title, description: req.body.description }, function(err, doc) {
        if(err) {
            res.statusMessage = 'Server error'
            res.status(500)
            res.json({error: 'Error inserting task: ' + err.message})
            return
        }

        res.statusMessage = 'Created'
        res.status(201)
        res.setHeader('Location', '/tasks/' + doc._id)
        res.json({success: 'Task created.'})
    })
})

app.all('/tasks', (req, res) => {
    res.statusMessage = 'Method not allowed'
    res.status(405)
    res.json({error: 'Method not allowed. Please use one of the active methods for this route.'})
})

app.get('/tasks/:id', (req, res) => {
    var id = req.params.id

    db.findOne({_id: id}, function(err, doc) {
        if(err) {
            res.statusMessage = 'Server error'
            res.status(500)
            res.json({error: 'Error getting task: ' + err.message})
            return
        }

        if(doc == null) {
            res.statusMessage = 'Not found'
            res.status(404)
            res.json({error: 'Resource not found.'})
            return
        }

        res.status(200)
        res.json(doc)
    })
})

app.post('/tasks/:id', (req, res) => {
    var id = req.params.id

    db.findOne({_id: id}, function(err, doc) {
        if(err) {
            res.statusMessage = 'Server error'
            res.status(500)
            res.json({error: 'Error getting task: ' + err.message})
            return
        }

        if(doc == null) {
            res.statusMessage = 'Not found'
            res.status(404)
            res.json({error: 'Resource not found.'})
            return
        }

        res.statusMessage = 'Conflict'
        res.status(409)
        res.json({error: 'Cannot POST here.'})
    })
})

app.put('/tasks/:id', (req, res) => {
    var id = req.params.id

    if(!req.body.title || !req.body.description) {
        res.statusMessage = 'Bad request'
        res.status(400)
        res.json({success: 'Missing title or description, please include them in body.'})
        return
    }

    db.findOne({_id: id}, function(err, doc) {
        if(err) {
            res.statusMessage = 'Server error'
            res.status(500)
            res.json({error: 'Error getting task: ' + err.message})
            return
        }

        if(doc == null) {
            res.statusMessage = 'Not found'
            res.status(404)
            res.json({error: 'Resource not found.'})
            return
        }

        db.update({ _id: id }, { title: req.body.title, description: req.body.description }, {}, function (err, numReplaced) {
            if(err) {
                res.statusMessage = 'Server error'
                res.status(500)
                res.json({error: 'Error updating task: ' + err.message})
                return
            }

            res.status(200)
            res.json({success: 'Document replaced.'})
        });

    })
})

app.patch('/tasks/:id', (req, res) => {
    var id = req.params.id

    if(!req.body.title && !req.body.description) {
        res.statusMessage = 'Bad request'
        res.status(400)
        res.json({success: 'Missing title and description, please include at least one in body.'})
        return
    }

    db.findOne({_id: id}, function(err, doc) {
        if(err) {
            res.statusMessage = 'Server error'
            res.status(500)
            res.json({error: 'Error getting task: ' + err.message})
            return
        }

        if(doc == null) {
            res.statusMessage = 'Not found'
            res.status(404)
            res.json({error: 'Resource not found.'})
            return
        }

        var to_set = {}
        if(req.body.title) to_set.title = req.body.title
        if(req.body.description) to_set.description = req.body.description

        db.update({ _id: id }, { $set: to_set }, {}, function (err, numReplaced) {
            if(err) {
                res.statusMessage = 'Server error'
                res.status(500)
                res.json({error: 'Error updating task: ' + err.message})
                return
            }

            res.status(200)
            res.json({success: 'Document updated.'})
        });

    })
})

app.delete('/tasks/:id', (req, res) => {
    var id = req.params.id

    db.findOne({_id: id}, function(err, doc) {
        if(err) {
            res.statusMessage = 'Server error'
            res.status(500)
            res.json({error: 'Error getting task: ' + err.message})
            return
        }

        if(doc == null) {
            res.statusMessage = 'Not found'
            res.status(404)
            res.json({error: 'Resource not found.'})
            return
        }

        var to_set = {}
        if(req.body.title) to_set.title = req.body.title
        if(req.body.description) to_set.description = req.body.description

        db.remove({ _id: id }, {}, function (err, numReplaced) {
            if(err) {
                res.statusMessage = 'Server error'
                res.status(500)
                res.json({error: 'Error updating task: ' + err.message})
                return
            }

            res.status(200)
            res.json({success: 'Document removed.'})
        });

    })
})


app.listen(port, () => console.log(`Example app listening on port ${port}!`))

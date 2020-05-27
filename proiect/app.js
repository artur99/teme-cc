'use strict'

const session = require('express-session');
const { parse } = require('querystring');
const model = require('./model');

const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
//const socketIo = require('socket.io')


const {Datastore} = require('@google-cloud/datastore');

// Instantiate a datastore client
const datastore = new Datastore();
const app = express();
app.enable('trust proxy');
//const server = http.createServer(app)
//const io = socketIo(server)

const locationMap = new Map();

app.enable('trust proxy');

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: 'trolololo'
}));

app.get('/', async (req, res, next) => {
  res.sendFile(__dirname + '/public/login.html');
});

app.use(express.static(path.join(__dirname, 'public')));

app.get('/.well-known/pki-validation/6A971462F937F147055BEAE63F9FA378.txt', async (req, res, next) => {
  res.sendFile(__dirname + '/public/6A971462F937F147055BEAE63F9FA378.txt');
});

app.get('/tba', async (req, res, next) => {
    if(!req.session.user_id) {
        res.redirect("/")
        return
    }

  res.sendFile(__dirname +'/public/index.html');

});





//PARTEA DE MAPS trebuie regandite requests pentru ca socket.io da eroare pe server

app.get('/w', async (req, res, next) => {
  res.sendFile(__dirname + '/public/viewer.html');
});

app.get('/t', async (req, res, next) => {
  res.sendFile(__dirname + '/public/tracker.html');
});

/*io.on('connection', socket => {
  socket.on('updateLocation', pos => {
    locationMap.set(socket.id, pos)
  })

  socket.on('requestLocations', () => {
    socket.emit('locationsUpdate', Array.from(locationMap))
  })

  socket.on('disconnect', () => {
    locationMap.delete(socket.id)
  })
})*/
app.post('/get_driver_location', async(req,res)=>{
    var result = await model.getDriverLocation(req.session.user_id); //
    res.json(result);
})

app.post('/get_passengers_location', async(req,res)=>{
    var result = await model.getPassengersLocation(req.session.user_id); //
    res.json(result);
})

app.post('/add_trip', async (req, res) => {
    var vars = req.body
    var tasks = await model.addNewTrip(vars.from, vars.to, vars.price, vars.number_of_persons, vars.date, vars.time, req.session.user_id ); //req.session.user_id
    //console.log("tasks"+tasks);
    res.status(200);
    res.send();
});

app.post('/send_feedback', async (req, res) => {
    var vars = req.body
    await model.addFeedback(vars.feedback, vars.driver_id, req.session.user_id ); //req.session.user_id
    res.status(200);
    res.send();
});

app.post('/update_location', async (req, res) => {
    var vars = req.body
    var tasks = await model.updateLocation(vars.lat, vars.lng, req.session.user_id);

    res.send("ok")
});

app.post('/register', async (req, res) => {
    var vars = req.body

    var tasks = await model.addNewUser(vars.firstname, vars.lastname, vars.email, vars.password ); //req.session.user_id
    //console.log("tasks"+tasks);
    res.status(200);
    res.send();
});


app.post('/login', async (req, res) => {
    var vars = req.body
    var tasks = await model.checkLogin(vars.email, vars.password ); //req.session.user_id
    //console.log("tasks"+tasks);
    if(tasks){
      console.log("true");
      req.session.user_id = await model.getSessionId(vars.email, vars.password);
      req.session.save();
      res.status(200);
      res.send();
    }
    else{
      console.log("false");
      res.redirect('/');

    }
});

app.post('/check_if_has_car', async (req, res) => {
    var result = await model.checkIfHasCar(req.session.user_id); //
    res.json(result);
});

app.post('/book_trip', async (req, res) => {
    var vars = req.body
    await model.bookTrip(vars.from, vars.to, vars.date, vars.time, vars.price,vars.driver_id, req.session.user_id ); //req.session.user_id
    res.status(200);
    res.send();
});

app.post('/cancel_book', async (req, res) => {
    var vars = req.body
    await model.unbookTrip(vars.from, vars.to, vars.date, vars.time, vars.price,vars.driver_id, req.session.user_id ); //req.session.user_id
    res.status(200);
    res.send();
});

app.post('/load_search_suggestions_for_cities', async (req, res) => {
    var vars = req.body
    var cities = await model.getSearchSuggestions(vars.string);
    //console.log("orase"+cities[0])
    res.json(cities);
});

app.post('/search_trips', async (req, res) => {
    var vars = req.body
    var trips = await model.searchForTrips(vars.from, vars.to, vars.date, req.session.user_id);
    //console.log("orase"+cities[0])
    res.json(trips);
});

app.post('/load_my_reviews', async (req, res) => {
    var result = await model.getMyReviews(req.session.user_id);
    res.json(result);
});

app.post('/load_my_trip_as_passenger', async (req, res) => {
    var vars = req.body
    var trips = await model.loadMyTripAsPassenger(req.session.user_id);
    //console.log("orase"+cities[0])
    res.json(trips);
});

app.post('/load_my_trip_as_driver', async (req, res) => {
    var vars = req.body
    var trips = await model.loadMyTripAsDriver(req.session.user_id);
    //console.log("orase"+cities[0])
    res.json(trips);
});


app.post('/load_profile', async (req, res) => {
    var infos = await model.loadProfileInfos(req.session.user_id);
    res.json(infos);
});

app.post('/update_description', async (req, res) => {
    var vars = req.body
    await model.updateUserDescription(vars.description, req.session.user_id);
    res.status(200);
    res.send();
});

app.post('/add_car', async (req, res) => {
    var vars = req.body
    await model.addUserCar(vars.name, vars.color, vars.number, vars.type, vars.year, req.session.user_id);
    res.status(200);
    res.send();
});

app.post('/set_trip_promoted', async (req, res) => {
    var trip_id = req.body.trip_id

    await model.setTripPromoted(trip_id);
    res.status(200);
    res.send("ok");
});

app.post('/post_ad', async (req, res) => {
    var vars = req.body
    await model.addAd(vars.title, vars.desc, req.session.user_id);

    res.status(200);
    res.send();
});

app.post('/get_ads', async (req, res) => {
    var ads = await model.getAds();
    res.json(ads);
});


app.post('/send_message_to_support', async (req, res) => {
    var vars = req.body
    await model.sendMessageToSupport(vars.text, req.session.user_id);
    res.status(200);
    res.send();
});

app.post('/send_message_to', async (req, res) => {
    var vars = req.body
    await model.sendMessageTo(vars.text, vars.id, req.session.user_id);
    res.status(200);
    res.send();
});

app.post('/load_messages', async (req, res) => {
    var result = await model.loadMessages(req.session.user_id);
    res.json(result);
});


/*Testing distance and drive time*/
/*
const options = {
    url: 'https://maps.googleapis.com/maps/api/directions/json?origin=Iasi&destination=Vaslui&key=AIzaSyAdmdrQMP05i2W5T854CKftySVJw2KvtzQ&sensor=false&avoid=highways&mode=driving',
    method: 'GET',
    headers: {
        'Accept': 'application/json',
        'Accept-Charset': 'utf-8',

    }
};

request(options, function(err, res, body) {
    let json = JSON.parse(body);
    console.log(json);
    console.log(json.routes[0].legs[0].distance.text)
    console.log(json.routes[0].legs[0].duration.text)
});
*/




 const PORT = process.env.PORT || 8083;
app.listen(process.env.PORT || 8083, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});


module.exports = app;

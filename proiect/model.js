const {Datastore} = require('@google-cloud/datastore');
const express = require('express');
// Your Google Cloud Platform project ID

const projectId = 'tripbookingapp-277517';
const keyFilename = './TripBookingApp-ca8b1d12cf69.json';
// Creates a client
const datastore = new Datastore(({projectId,keyFilename}));
const request = require('request');

var addNewTrip = async (from, to, price, passengers_nr, date, time, driver_id)=>{
	var actual_passenger_no = "0";
	var passenger_id = " ";
    await datastore.save({
    key: datastore.key('booking'),
    data: {date, from, to, price ,driver_id, passenger_id ,passengers_nr, time,actual_passenger_no}})
}

var addNewUser = async (firstname, lastname, email, password)=>{
    await datastore.save({
    key: datastore.key('users'),
    data: {firstname, lastname, email, password}})
    return true;
}

var  checkLogin = async (email, password)=>{
	var resu;
    var queryi = datastore.createQuery('users').filter('email', '=', email)
		.filter('password','=',password);
    var [login] = await datastore.runQuery(queryi);

    if(login.length<1)
    	return false;
    return true;

}

var  checkIfHasCar = async (user_id)=>{
	var resu;
    var queryi = datastore.createQuery('cars').filter('owner_id', '=', user_id);
    var [car] = await datastore.runQuery(queryi);
    if(car.length<1)
    	return false;
    return true;

}


var getSessionId = async(email, pass)=>{
	var query = datastore.createQuery('users').filter('email', '=', email.toString()).filter('password','=',pass.toString());
    var [tasks] = await datastore.runQuery(query)
    return tasks[0][datastore.KEY].id;
}

var bookTrip = async (from, to, date, time, price, driver_id, passenger_id)=>{
	var queryi = datastore.createQuery('booking').filter('from', '=', from)
		.filter('to','=',to)
		.filter('time','=',time)
		.filter('driver_id','=',driver_id);
    var [trips] = await datastore.runQuery(queryi);
    var actual_passenger_no = parseInt(trips[0].actual_passenger_no,10)+1;
    var passengers_nr = trips[0].passengers_nr;
    await datastore.save({
    key: datastore.key('booking'),
    data: {date, from, to, price ,driver_id, passengers_nr, time,actual_passenger_no, passenger_id}})

}

var unbookTrip = async (from, to, date, time, price, driver_id, passenger_id)=>{
	var queryi = datastore.createQuery('booking').filter('from', '=', from)
		.filter('to','=',to)
		.filter('time','=',time)
		.filter('driver_id','=',driver_id)
		.filter('passenger_id','=',passenger_id);
    var [trips] = await datastore.runQuery(queryi);
    const key = trips[0][datastore.KEY];
    await datastore.delete(key);

    var query = datastore.createQuery('booking').filter('from', '=', from)
		.filter('to','=',to)
		.filter('time','=',time)
		.filter('driver_id','=',driver_id)
    var [new_trips] = await datastore.runQuery(query);
    for(let j in new_trips){
    	var id = new_trips[j][datastore.KEY].id;
    	const [entity] = await datastore.get(datastore.key(['booking', parseInt(id)]));
    	var actual = parseInt(entity.actual_passenger_no,10);
    	if(actual !=0){
    		actual = actual -1;
			entity.actual_passenger_no = actual.toString() ;
			await datastore.update(entity)

		}
    }


}

var suggestions = [];
var getSearchSuggestions = async (string)=>{
	var link = "https://maps.googleapis.com/maps/api/place/autocomplete/json?input="+string+"&types=(cities)&components=country:ro&language=ro&key=AIzaSyAdmdrQMP05i2W5T854CKftySVJw2KvtzQ";
    const options2 = {
    url: link ,
    method: 'GET',
    headers: {
        'Accept': 'application/json',
        'Accept-Charset': 'utf-8',

    }
	};

	await request(options2, function(err, res, body) {
		if(body!=undefined){
	    let json = JSON.parse(body);
	    for(var i=0;i<json.predictions.length;i++ ){
	      //console.log("sugestie"+json.predictions[i].description);
	      var city = json.predictions[i].description;
	      //console.log("city"+city)
	      suggestions[i]=city;
	    }
	    //console.log("inside"+suggestions[0])
	    //return suggestions;

	}
	});
	//console.log("outside"+suggestions[0])
	return suggestions;
}


var searchForTrips = async (from, to, date, passenger_id)=>{
	console.log("get",from,to,date)
	var query = datastore.createQuery('booking').filter('from','=',from).filter('to','=',to).filter('date','=',date);
    var [trips] = await datastore.runQuery(query);
    var result_trips =[];
    var already_booked = [];
    var max_persons=0;
	for(let i in trips) {
		if(trips[i].passenger_id.toString() == passenger_id.toString()){
    	 	already_booked.push(trips[i][datastore.KEY].id);
    	 }
    	 if(max_persons <= parseInt(trips[i].actual_passenger_no,10))
    	 	max_persons = parseInt(trips[i].actual_passenger_no,10);
	}
	if(already_booked.length!=0)
		return result_trips;
	var drivers_ids = [];
	// console.log(trips.length)
    for(let i in trips) {
	  	// if(!drivers_ids.includes(trips[i].driver_id))
			if(max_persons < parseInt(trips[i].passengers_nr,10)){
				var id = trips[i].driver_id;
				var queryi = datastore.createQuery('cars').filter('owner_id','=', id.toString() );
				var [driver_car] = await datastore.runQuery(queryi);

				var myquery = datastore.createQuery('reviews').filter('to_user_id','=',trips[i].driver_id);
				var [reviews] = await datastore.runQuery(myquery);
				var driver_reviews=[];
				for(let k in reviews){
					driver_reviews.push({review:reviews[k].review});
				}



				const [driver_details] = await datastore.get(datastore.key(['users', parseInt(trips[i].driver_id)]));

		    	var item = {
					trip_id: trips[i][datastore.KEY].id,
					trip_promoted: trips[i].promoted ? true : false,
					driver_name: driver_details.firstname+" "+driver_details.lastname,
					c_name:driver_car[0].car_name,
					c_color:driver_car[0].color,
					c_reg_no:driver_car[0].reg_no,
					c_type:driver_car[0].type,
					c_year:driver_car[0].year,
					price: trips[i].price,
					time: trips[i].time,
					driver_id: trips[i].driver_id,
					actual_passengers: max_persons,
					max_persons:trips[i].passengers_nr,
					description: driver_details.description,
					reviews: driver_reviews
				};/*);*/

		    	 result_trips.push(item);
		    	 drivers_ids.push(trips[i].driver_id);

			}

    }

	return result_trips;
}

let distance;
let duration;
var  loadMyTripAsPassenger = async (passenger_id)=>{

	var query = datastore.createQuery('booking').filter('passenger_id','=',passenger_id);
    var [trips] = await datastore.runQuery(query);
    var result_trips =[];

	    for(let i in trips) {


	    			var from = trips[i].from;
	    			from= from.normalize("NFD").replace(/[\u0300-\u036f]/g,"");
	    			var to = trips[i].to;
	    			to = to.normalize("NFD").replace(/[\u0300-\u036f]/g,"");
	    			console.log("FROM TO:",from,to);
	    			var link = "https://maps.googleapis.com/maps/api/directions/json?origin="+from+"&destination="+to+"&region=ro&language=ro&key=AIzaSyAdmdrQMP05i2W5T854CKftySVJw2KvtzQ&sensor=false&avoid=highways&mode=driving";
	    			const options = {
					    url: link,
					    method: 'GET',
					    headers: {
					        'Accept': 'application/json',
					        'Accept-Charset': 'utf-8',

					    }
					};


				   	await request(options, function(err, res, body) {
					    let json = JSON.parse(body);

					     distance = json.routes[0].legs[0].distance.text;
					     duration = json.routes[0].legs[0].duration.text;

					    console.log(json.routes[0].legs[0].distance.text);
					    console.log(json.routes[0].legs[0].duration.text);

					    console.log("inside",distance, duration);
					 }).on('finish', function() {
				        console.log("outside on", distance, duration);

				    });
					console.log("outside", distance,duration);

		    		var id = trips[i].driver_id;
		    		var queryi = datastore.createQuery('cars').filter('owner_id','=', id.toString() );
	    			var [driver_car] = await datastore.runQuery(queryi);

	    			const [driver_details] = await datastore.get(datastore.key(['users', parseInt(trips[i].driver_id)]));

		        	 var item = {
						 trip_id: trips[i][datastore.KEY].id,
						 trip_promoted: trips[i].promoted ? true : false,
						 driver_name: driver_details.firstname+" "+driver_details.lastname,
			        	 c_name:driver_car[0].car_name,
			        	 c_color:driver_car[0].color,
			        	 c_reg_no:driver_car[0].reg_no,
			        	 c_type:driver_car[0].type,
			        	 c_year:driver_car[0].year,
			        	 price: trips[i].price,
			        	 time: trips[i].time,
			        	 driver_id: trips[i].driver_id,
			        	 description: driver_details.description,
			        	 distance:distance,
			        	 duration:duration,
			        	 from: trips[i].from,
			        	 to:trips[i].to,
			        	 date: trips[i].date
					 };
		        	 result_trips.push(item);
	    }

	return result_trips;
}


var  loadMyTripAsDriver = async (driver_id)=>{

	var query = datastore.createQuery('booking').filter('driver_id','=',driver_id);
    var [trips] = await datastore.runQuery(query);
    var result_trips =[];
    var persons = 0;
    var passengers =[];
    for(let i in trips){
    	if(trips[i].passenger_id!=undefined && trips[i].passenger_id.length>3){
    		persons += 1;
    		const [passenger_details] = await datastore.get(datastore.key(['users', parseInt(trips[i].passenger_id)]));
    		passengers.push({name: passenger_details.firstname+" "+passenger_details.lastname});
    	}
    }

	for(let i in trips) {

		var from = trips[i].from;
		from = from.normalize("NFD").replace(/[\u0300-\u036f]/g,"");
		var to = trips[i].to;
		to = to.normalize("NFD").replace(/[\u0300-\u036f]/g,"");
		console.log("FROM TO:",from,to);
		var link = "https://maps.googleapis.com/maps/api/directions/json?origin="+from+"&destination="+to+"&region=ro&language=ro&key=AIzaSyAdmdrQMP05i2W5T854CKftySVJw2KvtzQ&sensor=false&avoid=highways&mode=driving";
		const options = {
		    url: link,
		    method: 'GET',
		    headers: {
		        'Accept': 'application/json',
		        'Accept-Charset': 'utf-8',

		    }
		};


	   	await request(options, function(err, res, body) {
		    let json = JSON.parse(body);

		     distance = json.routes[0].legs[0].distance.text;
		     duration = json.routes[0].legs[0].duration.text;

		    console.log(json.routes[0].legs[0].distance.text);
		    console.log(json.routes[0].legs[0].duration.text);

		    console.log("inside",distance, duration);
		 }).on('finish', function() {
	        console.log("outside on", distance, duration);

	    });
		console.log("outside", distance,duration);

		var id = trips[i].driver_id;
		var queryi = datastore.createQuery('cars').filter('owner_id','=', id.toString() );
		var [driver_car] = await datastore.runQuery(queryi);

		const [driver_details] = await datastore.get(datastore.key(['users', parseInt(trips[i].driver_id)]));
    	 var item = {
			 trip_id: trips[i][datastore.KEY].id,
			 trip_promoted: trips[i].promoted ? true : false,
			 driver_name: driver_details.firstname+" "+driver_details.lastname,
        	 c_name:driver_car[0].car_name,
        	 c_color:driver_car[0].color,
        	 c_reg_no:driver_car[0].reg_no,
        	 c_type:driver_car[0].type,
        	 c_year:driver_car[0].year,
        	 price: trips[i].price,
        	 time: trips[i].time,
        	 driver_id: trips[i].driver_id,
        	 description: driver_details.description,
        	 distance:distance,
        	 duration:duration,
        	 from: trips[i].from,
        	 to:trips[i].to,
        	 date: trips[i].date,
        	 count_persons: persons,
        	 max_persons:trips[i].passengers_nr,
        	 persons: passengers
		 };
    	 result_trips.push(item);
	    }

	return result_trips;
}



var loadProfileInfos = async (user_id)=>{

	var results = [];
	var queryi = datastore.createQuery('cars').filter('owner_id','=', user_id.toString() );
	var [driver_car] = await datastore.runQuery(queryi);
	const [driver_details] = await datastore.get(datastore.key(['users', parseInt(user_id)]));

	if(driver_car[0]!=undefined)
		results.push({
			name: driver_details.firstname+" "+driver_details.lastname,
			description: driver_details.description,
			c_name:driver_car[0].car_name,
			c_color:driver_car[0].color,
			c_reg_no:driver_car[0].reg_no,
			c_type:driver_car[0].type,
			c_year:driver_car[0].year,
		});
	else{
		results.push({
			name: driver_details.firstname+" "+driver_details.lastname,
			description: driver_details.description,
			c_name:undefined,
			c_color:undefined,
			c_reg_no:undefined,
			c_type:undefined,
			c_year:undefined,
		});
	}

	return results;
}

var updateUserDescription = async (description,user_id)=>{
	const [entity] = await datastore.get(datastore.key(['users', parseInt(user_id)]));
	entity.description = description;
	await datastore.update(entity)
	console.log(description)
}
var addUserCar = async (car_name, color, reg_no, type, year, owner_id)=>{
	await datastore.save({
    key: datastore.key('cars'),
    data: {car_name, color, owner_id, reg_no , type, year}})
}

var addFeedback = async ( review, to_user_id, from_user_id)=>{
	await datastore.save({
    key: datastore.key('reviews'),
    data: {to_user_id, review, from_user_id}})
}

var sendMessageToSupport = async ( text, from_id)=>{
	var to_id="support";
	//var moment = require('moment');
	var time = new Date();//moment().format('yyyy-mm-dd:hh:mm:ss');
	await datastore.save({
    key: datastore.key('messenger'),
    data: {text, from_id, to_id, time}})
}
var sendMessageTo = async ( text,to_id, from_id)=>{

	//var moment = require('moment');
	var time = new Date();//moment().format('yyyy-mm-dd:hh:mm:ss');
	await datastore.save({
    key: datastore.key('messenger'),
    data: {text, from_id, to_id, time}})
}

var loadMessages = async (user_id)=>{
	var query = datastore.createQuery('messenger').filter('to_id','=', user_id.toString());

    var [messages] = await datastore.runQuery(query);
    var results = [];
    var ids =[];
    var from_id;
    for(let i in messages){
    	if(!ids.includes(messages[i].from_id)){
    	 from_id = messages[i].from_id;
    	 ids.push(from_id)
	    const [entity] = await datastore.get(datastore.key(['users', parseInt(from_id)]));
	    var queryi = datastore.createQuery('messenger')
	    	.filter('to_id','=', user_id.toString())
	    	.filter('from_id','=', from_id.toString())
    	var [from_m] = await datastore.runQuery(queryi);
    	from_m = from_m.sort((a, b) => a.time - b.time)
    	var from_mes = []
    	if(from_m!=undefined)
    	for(let k in from_m){
    		if(from_m[k].text.length>0)
    		from_mes.push(from_m[k].text)
    	}
    	var queryii = datastore.createQuery('messenger')
	    	.filter('from_id','=', user_id.toString())
	    	.filter('to_id','=', from_id.toString())
    	var [to_m] = await datastore.runQuery(queryii);
    	to_m = to_m.sort((a, b) => a.time - b.time)
    	var to_mes = []
    	if(to_m!=undefined)
    	for(let k in to_m){
    		if(to_m[k].text.length>0)
    		to_mes.push(to_m[k].text)
    	}
	    results.push({from: entity.firstname+" "+entity.lastname, from_m:from_mes, to_m: to_mes, id: entity[datastore.KEY].id})
    }
}
    return results;
}

var getMyReviews = async (user_id)=>{
	var query = datastore.createQuery('reviews').filter('to_user_id','=',user_id);
    var [reviews] = await datastore.runQuery(query);
    var result = []
    for(let i in reviews){
    	result.push({review:reviews[i].review})
    }
    return result;
}

var getDriverLocation = async (passenger_id)=>{
	 var query = datastore.createQuery('booking').filter('passenger_id','=', passenger_id);
     var [driver] = await datastore.runQuery(query);
     if(driver[0].length ==0)return ;
     var driver_id = driver[0].driver_id;
     const [entity] = await datastore.get(datastore.key(['users', parseInt(driver_id)]));
     console.log(entity.position.longitude,entity.position.latitude)
     return {Lat:entity.position.latitude, Lng:entity.position.longitude, driver_name:entity.firstname+" "+entity.lastname};
}

var getPassengersLocation = async (driver_id)=>{
	 var query = datastore.createQuery('booking').filter('driver_id','=', driver_id);
     var [clients] = await datastore.runQuery(query);
     if(clients.length ==0)return;
     var results = []
     for(let i in clients ){
     	if(clients[i].passenger_id.length>3){
	     	var client_id = clients[i].passenger_id;
	     	const [entity] = await datastore.get(datastore.key(['users', parseInt(client_id)]));
	     	results.push({Lat:entity.position.latitude, Lng:entity.position.longitude, driver_name:entity.firstname+" "+entity.lastname})
     	}
     }

     return results;
}

var updateLocation = async (lat, lng, passenger_id)=>{
    const [entity] = await datastore.get(datastore.key(['users', parseInt(passenger_id)]));
    const coordinates = {
  latitude: parseFloat(lat),
  longitude: parseFloat(lng)
};
const geoPoint = datastore.geoPoint(coordinates);
    entity.position = geoPoint;
	await datastore.update(entity)
}


var setTripPromoted = async (trip_id) => {
	const [trip] = await datastore.get(datastore.key(['booking', parseInt(trip_id)]));

	trip.promoted = !trip.promoted;
	datastore.update(trip)
}

var addAd = async (title, description, owner_id)=>{
	await datastore.save({
    key: datastore.key('ads'),
    data: {title, description, owner_id}})
}

var getAds = async _ => {
	// var query = datastore.createQuery('ads').filter('to_user_id','=',user_id);
	var query = datastore.createQuery('ads')
    var [ads] = await datastore.runQuery(query);

    return ads;
}

module.exports={
	addNewTrip: addNewTrip,
	getSearchSuggestions: getSearchSuggestions,
	searchForTrips: searchForTrips,
	bookTrip: bookTrip,
	addNewUser:addNewUser,
	checkLogin:checkLogin,
	getSessionId:getSessionId,
	checkIfHasCar:checkIfHasCar,
	loadProfileInfos: loadProfileInfos,
	updateUserDescription: updateUserDescription,
	addUserCar: addUserCar,
	loadMyTripAsPassenger:loadMyTripAsPassenger,
	unbookTrip:unbookTrip,
	loadMyTripAsDriver: loadMyTripAsDriver,
	getDriverLocation: getDriverLocation,
	updateLocation: updateLocation,
	getPassengersLocation: getPassengersLocation,
	addFeedback:addFeedback,
	getMyReviews: getMyReviews,
	setTripPromoted: setTripPromoted,
	addAd: addAd,
	getAds: getAds,
	sendMessageToSupport: sendMessageToSupport,
	loadMessages: loadMessages,
	sendMessageTo: sendMessageTo
}

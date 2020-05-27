/*menu functions*/
function showSearch(){
	document.getElementById("search").style.display="block";
	document.getElementById("add-trip").style.display="none";
	document.getElementById("profile").style.display="none";
	document.getElementById("inbox").style.display="none";
	document.getElementById("gallery").style.display="none";
	document.getElementById("dots").style.display="none";
	document.getElementById("trip").style.display="none";
	document.getElementById("ads").style.display="none";
	document.getElementById("support").style.display="none"
}
function showAdd(){
	document.getElementById("search").style.display="none";
	document.getElementById("add-trip").style.display="block";
	document.getElementById("profile").style.display="none";
	document.getElementById("inbox").style.display="none";
	document.getElementById("gallery").style.display="none";
	document.getElementById("dots").style.display="none";
	document.getElementById("trip").style.display="none";
	document.getElementById("ads").style.display="none";
	document.getElementById("support").style.display="none"
}
async function showProfile(){
	document.getElementById("search").style.display="none";
	document.getElementById("add-trip").style.display="none";
	document.getElementById("profile").style.display="block";
	document.getElementById("inbox").style.display="none";
	document.getElementById("gallery").style.display="none";
	document.getElementById("dots").style.display="none";
	document.getElementById("trip").style.display="none";
	document.getElementById("ads").style.display="none";
	document.getElementById("support").style.display="none";
	await loadProfile();

}
function showInbox(){
	document.getElementById("search").style.display="none";
	document.getElementById("add-trip").style.display="none";
	document.getElementById("profile").style.display="none";
	document.getElementById("inbox").style.display="block";
	document.getElementById("gallery").style.display="none";
	document.getElementById("dots").style.display="none";
	document.getElementById("trip").style.display="none";
	document.getElementById("ads").style.display="none";
	document.getElementById("support").style.display="none"
}

function showHome(){
	document.getElementById("gallery").style.display="block";
	document.getElementById("dots").style.display="block";
	document.getElementById("search").style.display="none";
	document.getElementById("add-trip").style.display="none";
	document.getElementById("profile").style.display="none";
	document.getElementById("inbox").style.display="none";
	document.getElementById("trip").style.display="none";
	document.getElementById("ads").style.display="none";
	document.getElementById("support").style.display="none"
}

function showTrip(){
	document.getElementById("gallery").style.display="none";
	document.getElementById("dots").style.display="none";
	document.getElementById("search").style.display="none";
	document.getElementById("add-trip").style.display="none";
	document.getElementById("profile").style.display="none";
	document.getElementById("inbox").style.display="none";
	document.getElementById("trip").style.display="block";
	document.getElementById("ads").style.display="none";
	document.getElementById("support").style.display="none"
}

function showAds(){
	document.getElementById("gallery").style.display="none";
	document.getElementById("dots").style.display="none";
	document.getElementById("search").style.display="none";
	document.getElementById("add-trip").style.display="none";
	document.getElementById("profile").style.display="none";
	document.getElementById("inbox").style.display="none";
	document.getElementById("trip").style.display="none";
	document.getElementById("ads").style.display="block";
	document.getElementById("support").style.display="none"

}


function showSupport(){
	document.getElementById("support").style.display="block"
	document.getElementById("gallery").style.display="none";
	document.getElementById("dots").style.display="none";
	document.getElementById("search").style.display="none";
	document.getElementById("add-trip").style.display="none";
	document.getElementById("profile").style.display="none";
	document.getElementById("inbox").style.display="none";
	document.getElementById("trip").style.display="none";
	document.getElementById("ads").style.display="none";
}

async function showP(){
	console.log("clicked");
	document.getElementById("passBtn").style.backgroundColor="black"
	document.getElementById("passBtn").style.color="white"

	document.getElementById("driverBtn").style.backgroundColor="white";
	document.getElementById("driverBtn").style.color="black";

	document.getElementById("passengerOptions").style.display="block";
	document.getElementById("driverOptions").style.display="none";

}
function showD(){
	document.getElementById("passBtn").style.backgroundColor="white"
	document.getElementById("passBtn").style.color="black"

	document.getElementById("driverBtn").style.backgroundColor="black";
	document.getElementById("driverBtn").style.color="white";

	document.getElementById("passengerOptions").style.display="none";
	document.getElementById("driverOptions").style.display="block";
}
/*Gallery */
var slideIndex = 0;
showSlides();

function showSlides() {
  var i;
  var slides = document.getElementsByClassName("mySlides");
  var dots = document.getElementsByClassName("dot");
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  slideIndex++;
  if (slideIndex > slides.length) {slideIndex = 1}
  for (i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" active", "");
  }
  slides[slideIndex-1].style.display = "block";
  dots[slideIndex-1].className += " active";
  setTimeout(showSlides, 3000); // Change image every 2 seconds
}

/*functionalities*/
//car settings
var carShown =false;
function showCarSettings(){
	if(!carShown){
		document.getElementById("carBox").style.display="block"
		carShown = true
	}
	else{
		document.getElementById("carBox").style.display="none"
		carShown = false
	}
}

//OPEN support chat
function openForm() {
  document.getElementById("myForm").style.display = "block";
}

function closeForm() {
  document.getElementById("myForm").style.display = "none";
}

//Driver Add trip
async function addNewTrip(){
	console.log("click");
	var status = document.getElementById("add_trip_status");
	var from = document.getElementById("at_from").value;
	var to = document.getElementById("at_to").value;
	var price = document.getElementById("at_money").value;
	var nr_persons = document.getElementById("at_persons").value;
	var date = document.getElementById("at_date").value;
	var time = document.getElementById("at_time").value;
	if(from == "" || to == "" || price =="" || nr_persons =="" || date=="" || time==""){
		status.innerHTML = "Please complete all fields";

		status.style.color = "red";
		return;
	}
	var ok = false;
	await $.post("/check_if_has_car")
	.done(result =>{
		if(result){
			ok = true;
		}
		else{
			status.innerHTML="You don't have a car! Go to profile and add a new car before posting trips!";
			status.style.color="red";
			ok=false;
		}
	});
	if(!ok)return;


	await $.post("/add_trip",
	          		{from: from, to: to, price: price, number_of_persons: nr_persons, date:date, time:time})
	          	.done(function(){
	          		status.innerHTML = "Trip added";
             		status.style.color="green";

	          	})
	          	.fail(function(){
	          		status.innerHTML = "Can't add!";
             		status.style.color="red";
	          	});
}


async function searchTrip(){
	var status = document.getElementById("s_status");
	var from = document.getElementById("s_from").value;
	var to = document.getElementById("s_to").value;
	var date = document.getElementById("s_date").value;
	if(from =="" || to=="" || date==""){
		status.innerHTML = "Please complete all fields";
		status.style.color = "red";
		return;
	}
	await $.post("/search_trips",{from:from, to:to, date:date}).done(trips => {
        if(!trips) return;
        var searchBox = document.getElementById("searchResults");
        searchBox.innerHTML ="";
        var searchCount = document.createElement("h1");
        searchBox.appendChild(searchCount);
        searchCount.innerHTML="FOUND "+trips.length +" TRIPS";
        searchCount.style.backgroundColor="black";
        searchCount.style.color="white";

        for(var i=0;i<trips.length;i++){
           var tripBox = document.createElement("DIV");

		   if(trips[i].trip_promoted) {
			   tripBox.classList.add("promoted")
		   }
           var tripTitle = document.createElement("h2");

           tripTitle.innerHTML ="#"+(i+1)+" "+from.toUpperCase() + " > " + to.toUpperCase() +" Hour:<strong>"+ trips[i].time +"</strong><br>Passengers:<strong>" + trips[i].actual_passengers+"/"+trips[i].max_persons+"</strong>";
           var driver = document.createElement("P");
           driver.innerHTML = "<h3>DRIVER</br><strong>" + trips[i].driver_name.toUpperCase() +"<strong><br>\"" +trips[i].description+"\"";
           var driverReviews = document.createElement("h2");
           driverReviews.innerHTML="Driver Reviews<br>"
           var rev = trips[i].reviews;
           for(var k=0;k<rev.length;k++){
           		driverReviews.innerHTML +="\""+rev[k].review+"\"<br>"
           }


           var car = document.createElement("P");
           car.innerHTML = "<h3>TRIP CAR</h3><br>MODEL: "+trips[i].c_name.toUpperCase() +"<br>" + "COLOR: "+trips[i].c_color.toUpperCase() + "<br>" + "TYPE: "+trips[i].c_type.toUpperCase() +"<br>"+ "YEAR: "+trips[i].c_year +"<br>"+"LICENSE: "+trips[i].c_reg_no.toUpperCase();
           var price = document.createElement("P");
           price.innerHTML = "<h3>PRICE</h3> <strong><h1>"+trips[i].price+" LEI</h1></strong>";
           //console.log(labs_list[i].driver_name)
           var bookStatus = document.createElement("h4");
           var bookBtn = document.createElement("BUTTON");
           bookStatus.id="s"+i;
           bookBtn.id=i;
           bookBtn.className = "book-btn";
           bookBtn.innerHTML="BOOK NOW";
           bookBtn.style.marginBottom="30px";
           bookBtn.addEventListener('click', async function(){
           		console.log("pressed btn id"+ this.id);
           		await $.post("/book_trip",{from:from, to:to, date:date, time:trips[parseInt(this.id,10)].time,
           		driver_id:trips[parseInt(this.id,10)].driver_id, price: trips[parseInt(this.id,10)].price
           		});
           		document.getElementById(this.id).style.backgroundColor="green";
           		document.getElementById(this.id).innerHTML="BOOKED";
           		document.getElementById("s"+this.id).innerHTML="For more options, please check 'MyTrip' page.";
           })


           searchBox.appendChild(tripTitle);
           tripBox.appendChild(driver);
           tripBox.appendChild(driverReviews);
           tripBox.appendChild(car);
           tripBox.appendChild(price);
           tripBox.appendChild(bookStatus);
           tripBox.appendChild(bookBtn);
           tripBox.style.borderBottom="1px solid black";
           searchBox.appendChild(tripBox);

        }


    }).fail();
}
//PROFILE
//Function that load profile informations like name, descrption, car details an reviews
async function loadProfile(){
	await $.post("/load_profile").done(profile_infos => {
        if(!profile_infos) return;
        for(var i=0;i<profile_infos.length;i++){
        	document.getElementById("profile_name").innerHTML = profile_infos[i].name.toUpperCase();
        	if(profile_infos[i].description!=undefined){
        		document.getElementById("description").innerHTML = profile_infos[i].description;
        		document.getElementById("editDescriptionBox").innerHTML = profile_infos[i].description;
        	}
        	if(profile_infos[i].c_name!=undefined)
        		document.getElementById("carName").value = profile_infos[i].c_name;
        	if(profile_infos[i].c_color!=undefined)
        		document.getElementById("carColor").value = profile_infos[i].c_color;
        	if(profile_infos[i].c_reg_no!=undefined)
        		document.getElementById("carLicense").value = profile_infos[i].c_reg_no;
        	if(profile_infos[i].c_type!=undefined)
        		document.getElementById("carType").value = profile_infos[i].c_type;
        	if(profile_infos[i].c_year!=undefined)
        		document.getElementById("carYear").value = profile_infos[i].c_year;
        }
})
}

var editDesc=false;
function editDescription(){
	if(!editDesc){
		document.getElementById("descriptionDiv").style.display="block";
		editDesc = true;
	}
	else{
		document.getElementById("descriptionDiv").style.display="none";
		editDesc = false;
	}
}

async function updateDescription(){
	var description = document.getElementById("editDescriptionBox").value;
	if(description == "")return;
	await $.post("/update_description",{description:description})
	.done(()=>{
		document.getElementById("description").innerHTML = description;
		document.getElementById("descriptionDiv").style.display="none";
		editDesc = false;
	})

}

async function add_car(){
	var name = document.getElementById("carName").value
	var color = document.getElementById("carColor").value
	var number = document.getElementById("carLicense").value
	var type = document.getElementById("carType").value
	var year = document.getElementById("carYear").value
	if(name == "" || color =="" || number =="" || type =="" || year =="")
		return;
	await $.post("/add_car",{name:name, color:color, number:number, type:type, year:year})
	.done(()=>{
		document.getElementById("setCarBtn").innerHTML = "DONE";
	})
}


//MY TRIP
//Passenger
async function loadMyTripPassenger(){
	await $.post("/load_my_trip_as_passenger").done(trips => {
        if(!trips) return;

        var searchBox = document.getElementById("passengerTrip");
        searchBox.innerHTML ="";
        var searchCount = document.createElement("h1");
        searchBox.appendChild(searchCount);
        searchCount.innerHTML="FOUND "+trips.length +" TRIPS";
        searchCount.style.backgroundColor="black";
        searchCount.style.color="white";

        for(var i=0;i<trips.length;i++){
        	console.log("driver id", trips[i].driver_id)
           var tripBox = document.createElement("DIV");

           var tripTitle = document.createElement("h2");

           tripTitle.innerHTML ="#"+(i+1)+" "+trips[i].from.toUpperCase() + " > " + trips[i].to.toUpperCase() +"<br>DATE:<strong>"+trips[i].date +"</strong><br> DISTANCE: <strong>" + trips[i].distance +"</strong><br>TRIP START:<strong>"+ trips[i].time +"</strong><br>TRIP TAKES ABOUT:<strong>"+trips[i].duration+"</strong>";
           var driver = document.createElement("P");
           driver.innerHTML = "<h3>DRIVER</br><strong>" + trips[i].driver_name.toUpperCase() +"<strong><br>\"" +trips[i].description+"\"";
           var car = document.createElement("P");
           car.innerHTML = "<h3>TRIP CAR</h3><br>MODEL: "+trips[i].c_name.toUpperCase() +"<br>" + "COLOR: "+trips[i].c_color.toUpperCase() + "<br>" + "TYPE: "+trips[i].c_type.toUpperCase() +"<br>"+ "YEAR: "+trips[i].c_year +"<br>"+"LICENSE: "+trips[i].c_reg_no.toUpperCase();
           var price = document.createElement("P");
           price.innerHTML = "<h3>PRICE</h3> <strong><h1>"+trips[i].price+" LEI</h1></strong>";
           //console.log(labs_list[i].driver_name)
           var bookStatus = document.createElement("h4");
           var bookBtn = document.createElement("BUTTON");
           bookStatus.id="s"+i;
           bookBtn.id=i.toString()+i.toString();
           bookBtn.className = "book-btn";
           bookBtn.innerHTML="CANCEL BOOKING";
           bookBtn.style.marginBottom="30px";
           bookBtn.addEventListener('click', async function(){
           		console.log("pressed btn id"+ this.id);
           		var id = this.id;
           		await $.post("/cancel_book",{from:trips[parseInt(this.id,10)/10].from, to:trips[parseInt(this.id,10)/10].to, date:trips[parseInt(this.id,10)/10].date, time:trips[parseInt(this.id,10)/10].time,
           		driver_id:trips[parseInt(this.id,10)/10].driver_id, price: trips[parseInt(this.id,10)/10].price
           		}).done(function(){
           			document.getElementById(id).style.backgroundColor="RED";
           			document.getElementById(id).innerHTML="UNBOOKED";
           		})

           		//document.getElementById("s"+this.id).innerHTML="For more options, please check 'MyTrip' page.";
           })

           var feedback = document.createElement("input");
           feedback.type="input";
           feedback.id="ftext";
           feedback.placeholder = "feedback";
           var feedbackBtn = document.createElement("button");
           feedbackBtn.innerHTML = "SEND";
           feedbackBtn.id="fbtn";
           feedbackBtn.className = "book-btn";
           feedbackBtn.style.backgroundColor="green";
           var driver_idd = trips[i].driver_id;
           feedbackBtn.addEventListener('click', async function(){
           		var feedbackText = document.getElementById("ftext").value;
           		console.log("ftext",feedbackText)
           		if(feedbackText =="")return;
           		console.log("here")
           		await $.post("/send_feedback",{feedback:feedbackText, driver_id:driver_idd})
           		.done(function(){
           			  document.getElementById("ftext").value="";
           			 document.getElementById("fbtn").innerHTML="SENT";
           		})
           })

           searchBox.appendChild(tripTitle);
           tripBox.appendChild(driver);
           tripBox.appendChild(car);
           tripBox.appendChild(price);
           tripBox.appendChild(bookStatus);
           tripBox.appendChild(bookBtn);
           tripBox.innerHTML +="<br>";
           tripBox.appendChild(feedback);
           tripBox.innerHTML +="<br>";
           tripBox.appendChild(feedbackBtn);
           tripBox.style.borderBottom="1px solid black";
           searchBox.appendChild(tripBox);

        }


    }).fail();

}

var actualTrip=false;
async function showActualTrip(){
	if(!actualTrip){
		await loadMyTripPassenger();
		document.getElementById("passengerTrip").style.display="block";
		actualTrip = true;
	}
	else{
		document.getElementById("passengerTrip").style.display="none";
		actualTrip = false;
	}
}


async function loadMyTripDriver(){
	await $.post("/load_my_trip_as_driver").done(trips => {
        if(!trips) return;

        var searchBox = document.getElementById("driverTrip");
        searchBox.innerHTML ="";
        var searchCount = document.createElement("h1");
        searchBox.appendChild(searchCount);
        searchCount.innerHTML="FOUND "+trips.length +" TRIPS";
        searchCount.style.backgroundColor="black";
        searchCount.style.color="white";

        for(var i=0;i<trips.length;i++){
           var tripBox = document.createElement("DIV");

           var tripTitle = document.createElement("h2");

           tripTitle.innerHTML ="#"+(i+1)+" "+trips[i].from.toUpperCase() + " > " + trips[i].to.toUpperCase() +"<br>DATE:<strong>"+trips[i].date +"</strong><br> DISTANCE: <strong>" + trips[i].distance +"</strong><br>TRIP START:<strong>"+ trips[i].time +"</strong><br>TRIP TAKES ABOUT:<strong>"+trips[i].duration+"</strong><br>PASSENGERS:<strong>"+trips[i].count_persons+"/"+trips[i].max_persons+"</strong>";
           var passengersBox = document.createElement("h2");
           var list_persons = trips[i].persons;
           for(var j=0;j<list_persons.length;j++){
           		passengersBox.innerHTML +=(j+1).toString()+". "+list_persons[j].name+"<br>";
           }



           var driver = document.createElement("P");
           driver.innerHTML = "<h3>DRIVER</br><strong>" + trips[i].driver_name.toUpperCase() +"<strong><br>\"" +trips[i].description+"\"";
           var car = document.createElement("P");
           car.innerHTML = "<h3>TRIP CAR</h3><br>MODEL: "+trips[i].c_name.toUpperCase() +"<br>" + "COLOR: "+trips[i].c_color.toUpperCase() + "<br>" + "TYPE: "+trips[i].c_type.toUpperCase() +"<br>"+ "YEAR: "+trips[i].c_year +"<br>"+"LICENSE: "+trips[i].c_reg_no.toUpperCase();
           var price = document.createElement("P");
           price.innerHTML = "<h3>PRICE</h3> <strong><h1>"+trips[i].price+" LEI</h1></strong>";




           searchBox.appendChild(tripTitle);
           tripBox.appendChild(passengersBox);
           tripBox.appendChild(driver);
           tripBox.appendChild(car);
           tripBox.appendChild(price);

           tripBox.style.borderBottom="1px solid black";
           searchBox.appendChild(tripBox);

        }


    }).fail();

}



var driverActualtrip = false;
async function driverActualTrip(){
	if(!driverActualtrip){
		await loadMyTripDriver();
		document.getElementById("driverTrip").style.display="block";
		driverActualtrip = true;
	}
	else{
		document.getElementById("driverTrip").style.display="none";
		driverActualtrip = false;
	}
}




//Map viewer for Passenger who wants to see their driver position
let map
let map2
let markers = new Map()
 function initMap() {
	console.log("initMap")

  navigator.geolocation.getCurrentPosition(pos => {
    const { latitude: lat, longitude: lng } = pos.coords
    console.log(lat,lng)
    $.post("/update_location",{lat,lng});
    map = new google.maps.Map(document.getElementById('map'), {
      center: { lat, lng },
      zoom: 10
    })
  }, err => {
    console.error(err)
  })

}

//initMap()
async function loadMyDriverPos(){
	await $.post("/get_driver_location")
	.done(pos=>{
		var driver = pos.driver_name.toUpperCase();
		var position={lat:parseFloat(pos.Lat),lng:parseFloat(pos.Lng)}
		console.log("d pos",position.lat,position.lng)
		const marker = new google.maps.Marker({
          position,
          map,
          label: {
        color: 'black',
        fontWeight: 'bold',
        fontSize: '25px',
        text: driver,
        backgroundColor: 'black'
      },
      icon:{
        url: 'driver.png',
        scaledSize: new google.maps.Size(60, 60),
        //origin: new google.maps.Point(0,0), // origin
        //anchor: new google.maps.Point(0, 0)
      }
        })
	});
}

/*document.addEventListener('DOMContentLoaded', () => {
	loadMyDriverPos()
})*/


var mapP=false;
async function mapPassenger(){
	if(!mapP){
		console.log("map shown")
		await loadMyDriverPos();
		setInterval(() => {
		    loadMyDriverPos();
		  }, 2000)
		document.getElementById("map").style.display="block";
		mapP = true;
	}
	else{
		console.log("map unshown")
		document.getElementById("map").style.display="none";
		mapP = false;
	}
}

//Driver view passengers on map
function initMap2() {
	console.log("initMap")

  navigator.geolocation.getCurrentPosition(pos => {
    const { latitude: lat, longitude: lng } = pos.coords
    console.log(lat,lng)
    $.post("/update_location",{lat,lng});
    map2 = new google.maps.Map(document.getElementById('map2'), {
      center: { lat, lng },
      zoom: 10
    })
  }, err => {
    console.error(err)
  })

}
async function loadMyPassengersPos(){
	await $.post("/get_passengers_location")
	.done(pos=>{

	for(var i=0;i<pos.length;i++){

		var driver = pos[i].driver_name.toUpperCase();
		var position={lat:parseFloat(pos[i].Lat),lng:parseFloat(pos[i].Lng)}
		console.log("d pos",position.lat,position.lng)
		const marker = new google.maps.Marker({
          position,
          map,
          label: {
        color: 'black',
        fontWeight: 'bold',
        fontSize: '25px',
        text: driver,
        backgroundColor: 'black'
      },
      icon:{
        url: 'driver.png',
        scaledSize: new google.maps.Size(60, 60),
        //origin: new google.maps.Point(0,0), // origin
        //anchor: new google.maps.Point(0, 0)
      }
        })

	}
	});

}
var mapD=false;
async function mapDriver(){
	if(!mapD){
		console.log("map shown")
		await loadMyPassengersPos();
		setInterval(() => {
		    loadMyPassengersPos();
		  }, 2000)
		document.getElementById("map").style.display="block";
		mapD = true;
	}
	else{
		console.log("map unshown")
		document.getElementById("map").style.display="none";
		mapD = false;
	}
}


//PROFILE DISPLAY REVIEWS
async function loadMyReviews(){
	await $.post("/load_my_reviews").done(rev => {
        if(!rev) return;

        var revBox = document.getElementById("yourReviews");
        revBox.innerHTML ="";

        for(var i=0;i<rev.length;i++){
           var review = document.createElement("h2");
           review.innerHTML = "*"+rev[i].review;
           review.style.borderBottom="1px solid black";
           revBox.appendChild(review);
        }
    }).fail();
}

var shownReviews = false;
async function showReviews(){
	if(!shownReviews){
		await loadMyReviews();
		document.getElementById("yourReviews").style.display="block";
		shownReviews = true;
	}
	else{

		document.getElementById("yourReviews").style.display="none";
		shownReviews = false;
	}
}


async function promoteTrips() {
	var trips = await $.post("/load_my_trip_as_driver")

	var trip_select = {}

	for(let trip of trips) {
		trip_select[trip.trip_id] = `${trip.from} - ${trip.to} (${trip.date}; ${trip.time})`
	}

	const { value: selected_trip } = await Swal.fire({
		title: 'Select TRIP to be promoted.',
		input: 'select',
		inputOptions: trip_select,
		inputPlaceholder: 'Select a trip',
		showCancelButton: true
	})

	if (selected_trip) {
		$.post("/set_trip_promoted", {trip_id: selected_trip})
	}
}

async function postAd() {
	const { value: formValues } = await Swal.fire({
		title: 'Post Ad',
		html:
		'<input id="swal-input1" class="swal2-input" placeholder="Ad Title">' +
		'<input id="swal-input2" class="swal2-input" placeholder="Ad Description...">',
		focusConfirm: false,
		preConfirm: () => {
			return [
			  document.getElementById('swal-input1').value,
			  document.getElementById('swal-input2').value
			]
		}
	})

	if (formValues) {
		var title = formValues[0]
		var desc = formValues[1]

		$.post("/post_ad", {title: title, desc: desc})
	}
}


document.addEventListener( 'DOMContentLoaded', async function() {
	var ads = await $.post("/get_ads")

	ads = ads.map(x => ({v: x, s: Math.random()})).sort((a, b) => a.s - b.s).map(x => x.v)
	ads = ads.slice(0, 3)
	for(let ad of ads) {
		$(".ads").append(`<div class="ad"><h3>${ad.title}</h3><p>${ad.description}</p></div>`)
	}
})







//MESSENGER
var front = true;
function goFront(){
	document.getElementById("backMessenger").style.display="none";
	document.getElementById("frontMessenger").style.display="block";
}

async function refreshMessages(id){
	await $.post("/load_messages")
	.done(res=>{
		 console.log("do refresh of messeges")
		for(let i in res){
			if(res[i].id==id){
				var m=0,n=0;
				var from_m = res[i].from_m;
				var to_m = res[i].to_m;
				var messegesBox = document.getElementById("messegesBox");

				messegesBox.innerHTML="";
				while(m<from_m.length && n<to_m.length){
					var p_left = document.createElement("P")
					p_left.align="center";

					p_left.style.marginTop="50px"

					p_left.style.color="white";
					p_left.style.marginRight="60%";
					p_left.style.borderRadius="10px";
					p_left.style.marginLeft="5%";
					p_left.style.backgroundColor="blue"
					p_left.innerHTML = from_m[n]
					messegesBox.appendChild(p_left);
					var p_right = document.createElement("P")
					p_right.align="center";
					p_right.style.marginLeft="60%";
					p_right.style.marginRight="5%";
					p_right.style.borderRadius="10px";
					p_right.style.color="white";
					p_right.style.backgroundColor="blue"
					p_right.innerHTML = to_m[n]
					messegesBox.appendChild(p_right)
					m++;
					n++;
				}
				while(m<from_m.length){
					var p_left = document.createElement("P")
					p_left.align="center";

					p_left.style.marginTop="50px"

					p_left.style.color="white";
					p_left.style.marginRight="60%";
					p_left.style.borderRadius="10px";
					p_left.style.marginLeft="5%";
					p_left.style.backgroundColor="blue"
					p_left.innerHTML = from_m[n]
					messegesBox.appendChild(p_left);
					m++;
				}
				while(n<to_m.length){
					var p_right = document.createElement("P")
					p_right.align="center";
					p_right.style.marginLeft="60%";
					p_right.style.marginRight="5%";
					p_right.style.borderRadius="10px";
					p_right.style.color="white";
					p_right.style.backgroundColor="blue"
					p_right.innerHTML = to_m[n]
					messegesBox.appendChild(p_right)
					n++;
				}
			}
		}

})
}

var gl_interval;

async function loadMessages(){

	await $.post("/load_messages")
	.done(res=>{
		var front = document.getElementById("frontMessenger");
		for(let i in res){
			console.log(res[i].from, res[i].id)
			var from = document.createElement("DIV");
			from.id=i.toString();
			from.style.cursor="pointer";
			var sender = document.createElement("h3");
			sender.className="frontUsers";
			var text = document.createElement("p");
			sender.innerHTML = res[i].from.toUpperCase();
			//text.innerHTML="<strong>"+res[i].text+"</strong>";
			from.appendChild(sender);
			from.appendChild(text);
			front.appendChild(from);
			from.addEventListener('click',async function(){
				document.getElementById("frontMessenger").style.display="none";
				document.getElementById("backMessenger").style.display="block";
				var back = document.getElementById("mBox");
				back.innerHTML="";
				var m=0,n=0;
				var currentId = parseInt(this.id,10);

				var from_m = res[parseInt(this.id,10)].from_m;
				var to_m = res[parseInt(this.id,10)].to_m;
				var messegesBox = document.createElement("DIV");
				messegesBox.id="messegesBox";
				messegesBox.className = "overflowc"
				while(m<from_m.length && n<to_m.length){
					var p_left = document.createElement("P")
					p_left.align="center";

					p_left.style.marginTop="50px"

					p_left.style.color="white";
					p_left.style.marginRight="60%";
					p_left.style.borderRadius="10px";
					p_left.style.marginLeft="5%";
					p_left.style.backgroundColor="blue"
					p_left.innerHTML = from_m[n]
					messegesBox.appendChild(p_left);
					var p_right = document.createElement("P")
					p_right.align="center";
					p_right.style.marginLeft="60%";
					p_right.style.marginRight="5%";
					p_right.style.borderRadius="10px";
					p_right.style.color="white";
					p_right.style.backgroundColor="blue"
					p_right.innerHTML = to_m[n]
					messegesBox.appendChild(p_right)
					m++;
					n++;

				}
				while(m<from_m.length){
					var p_left = document.createElement("P")
					p_left.align="center";

					p_left.style.marginTop="50px"

					p_left.style.color="white";
					p_left.style.marginRight="60%";
					p_left.style.borderRadius="10px";
					p_left.style.marginLeft="5%";
					p_left.style.backgroundColor="blue"
					p_left.innerHTML = from_m[n]
					messegesBox.appendChild(p_left);
					m++;
				}
				while(n<to_m.length){
					var p_right = document.createElement("P")
					p_right.align="center";
					p_right.style.marginLeft="60%";
					p_right.style.marginRight="5%";
					p_right.style.borderRadius="10px";
					p_right.style.color="white";
					p_right.style.backgroundColor="blue"
					p_right.innerHTML = to_m[n]
					messegesBox.appendChild(p_right)
					n++;
				}
				back.appendChild(messegesBox);

				var sendDiv =document.createElement("div")
				sendDiv.style.marginTop="130px";
				var input = document.createElement("input");
				input.style.width="60%";
				input.style.borderRadius="10px";
				input.style.fontSize="15px;"
				var sendBtn = document.createElement("button");
				sendBtn.innerHTML="<strong>></strong>";
				sendBtn.style.fontSize="20px";
				sendBtn.style.cursor="pointer";
				sendBtn.style.backgroundColor="blue";
				sendBtn.style.borderRadius="20px";
				sendBtn.addEventListener('click', async function(){
					var text = input.value;
					console.log("send click input:",text)
					await $.post("/send_message_to",{id:res[currentId].id, text:text})
						.done( function(){
							//await loadMessages();
							  console.log("send mess done")

							  refreshMessages(res[currentId].id);
							  input.value="";

						});

				})
				sendDiv.appendChild(input)
				sendDiv.appendChild(sendBtn)
				back.appendChild(sendDiv);
				clearInterval(gl_interval);
							   gl_interval = setInterval(() => {
							    refreshMessages(res[currentId].id);
							  }, 2000)

			})
		}
	})
}

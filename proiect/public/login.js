
var login = true;
var register = false;
async function loginF(){
	if(login == true){
		//login
		var email = document.getElementById("lemail").value;
		var password = document.getElementById("lpassword").value;
		if( email == "" || password == "")return;
		await $.post("/login",
	          		{ email: email, password: password})
		.done(function(){
			window.location.replace('/tba');
		})

	}
	if(register==true){
		login = true;
		register = false;
		document.getElementById("register").style.display="none";
		document.getElementById("login").style.display="block";
	}
}

async function registerF(){
	if(register == false){
		register = true;
		login = false;
		document.getElementById("login").style.display="none";
		document.getElementById("register").style.display="block";
	}
	else{
		//register
		var firstname = document.getElementById("firstname").value;
		var lastname = document.getElementById("lastname").value;
		var email = document.getElementById("remail").value;
		var password = document.getElementById("rpassword").value;
		if(firstname == "" || lastname =="" || email == "" || password == "")return;
		await $.post("/register",
	          		{firstname: firstname, lastname: lastname, email: email, password: password})
	          	.done(function(){	          		 
  					login = true;
  					register = false;
  					document.getElementById("login").style.display="block";
					document.getElementById("register").style.display="none";

	          	})
	          	.fail(function(){
	          		 
	          	});
	}
}
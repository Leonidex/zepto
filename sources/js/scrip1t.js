/*-----------------------------------------*/
/*|||---|||---General functions---|||---|||*/
/*-----------------------------------------*/

function FindRootFolder()
{
	/*
	var loc = document.location.href.toString();
	loc = loc.substring(loc.indexOf('wwwroot')+7, loc.lastIndexOf('/')+1);
	if(loc.indexOf('localhost') === -1)
	{
		loc = 'http://localhost/'+loc;
	}
	
	else
	{
		loc = loc.replace('/localhost/','');
	}
	return loc;*/
	return '';
}

function IsUserLogged()
{
	if(localStorage.UsersList != undefined && localStorage.UsersList != '')
	{
		return true;
	}
	else
	{
		alert('Please sign up before continuing');
		$.mobile.navigate('#UserSignUp');
		return false;
	}
}

/*function Sleep(msec)
{
	var date = new Date();
	var start = date.getTime();
	
	while(date.getTime()<(start+msec))
	{
		var date = new Date();
	}
}*/

/*$(document).on('pageinit', function (event, xhr, settings){
	//console.log('event: '+event+', xhr: '+xhr+', settings: '+settings);
	console.log(event);
	console.log(xhr);
	console.log(settings);
});*/


	
/*------------------------------------------*/
/*|||---|||---HomePage functions---|||---|||*/
/*------------------------------------------*/

$(document).on('pageinit','#HomePage', function()
{
	//Year span at the bottom of the page
	var yearVar = new Date().getFullYear();
	$('#yearSpan').text(yearVar);

	//Navigation bar links
	$('nav>a').on('vclick', function(){
		$.mobile.navigate($(this).attr('href'));
	});
	
	if(typeof(Storage)=="undefined")	//localStorage detection
	{
		$('content').empty();
		$('content').html('<div>Please <span>update your browser</span> in order to continue using our site.<br/>Your current browser does not support HTML5 data storage technologies</div>');
		$('content div').css('text-align','center');
		$('content div span').css('color','red');
	}
});



/*--------------------------------------------*/
/*|||---|||---UserSignUp functions---|||---|||*/
/*--------------------------------------------*/

$(document).on('pageinit','#UserSignUp', function()
{
	//Setting BirthDay field requirements
	var today = new Date();
	var day = today.getDate();
	if(day<10) day = '0'+day;

	var month = today.getMonth()+1;
	if(month<10) month = '0'+month;

	var min = ((today.getFullYear()-120)+'-'+month+'-'+day)
	var max = ((today.getFullYear()-18)+'-'+month+'-'+day)
	$('#NewUser #BirthDay').attr('min', min.toString());
	$('#NewUser #BirthDay').attr('max', max.toString());

	var usersList = [];
	if(localStorage.UsersList != undefined && localStorage.UsersList != '')	//local storage was requested instead of actual server side implementation. 
	{
		usersList = localStorage.getItem('UsersList');
		usersList = $.parseJSON(usersList);
		var lastIndex = usersList.length-1;
		$('#NewUser').find(':input').each(function(){
			switch ($(this).attr('id'))
			{
				case 'IDNumber':
					$(this).val(usersList[lastIndex].IDNumber);
					break;
				case 'Password':
					$(this).val(usersList[lastIndex].Password);
					break;
				case 'Name':
					$(this).val(usersList[lastIndex].Name);
					break;
				case 'Email':
					$(this).val(usersList[lastIndex].Email);
					break;
				case 'Phone Number':
					$(this).val(usersList[lastIndex].PhoneNumber);
					break;
				case 'Cellphone Number':
					$(this).val(usersList[lastIndex].CellphoneNumber);
					break;
				case 'BirthDay':
					$(this).val(usersList[lastIndex].BirthDay);
					break;
				case 'License Number':
					$(this).val(usersList[lastIndex].LicenseNumber);
					break;
			}
		});
	}
	
	$('#NewUser').find('input').first().on('keyup', function(){CheckForDuplicate()});
	function CheckForDuplicate()
	{
		var duplicate = false;
		for(var i=0; i<usersList.length; i++)
		{
			if(usersList[i].IDNumber == $('#NewUser').find('input').first().val())
			{
				duplicate = true;
			}
		}
		
		if(duplicate)
		{
			$('#NewUser').find('span').first().text('ID already in use');
		}
		else
		{
			$('#NewUser').find('span').first().text('');
		}
		
		return duplicate;
	}

	$('#NewUser').on('submit', function(e){
		e.preventDefault();
		//Checking for duplicates in ID
		if(CheckForDuplicate())
		{
			alert('This ID already exists in our records!\n(Maybe you are already signed in?)');
			return false;
		}
		
		$(this).find('input').each(function(){
			switch ($(this).attr('id'))
			{
				case 'IDNumber':
					idNumber = $(this).val();
					break;
				case 'Password':
					password = $(this).val();
					break;
				case 'Name':
					name = $(this).val();
					break;
				case 'Email':
					email = $(this).val();
					break;
				case 'Phone Number':
					phoneNumber = $(this).val();
					break;
				case 'Cellphone Number':
					cellphoneNumber = $(this).val();
					break;
				case 'BirthDay':
					birthDay = $(this).val();
					break;
				case 'License Number':
					licenseNumber = $(this).val();
					break;
			}
		});
		
		if(phoneNumber || cellphoneNumber)
		{
			var newUser = {
				'IDNumber':idNumber ,
				'Password':password ,
				'Name':name ,
				'Email':email ,
				'PhoneNumber':phoneNumber ,
				'CellphoneNumber':cellphoneNumber ,
				'BirthDay':birthDay ,
				'LicenseNumber':licenseNumber
				};
			console.log(usersList);
			usersList.push(newUser);
			
			var stringUsersList = JSON.stringify(usersList);
			
			localStorage.setItem('UsersList' ,stringUsersList);
			
			$.get('distant lands/userDB.php', stringUsersList).done(function(){
				console.log('Data sent to DB');
			});
			
			$.mobile.navigate('#CarSelect');
		}
		else
		{
			alert('Please enter atleast one phone number');
		}
		return false;
	});
	
	$('#NewUser').find('input').first().on('change', function(){
		$(this).siblings('span').text('');
	});
	
});



/*-------------------------------------------*/
/*|||---|||---CarSelect functions---|||---|||*/
/*-------------------------------------------*/

$(document).on('pageshow','#CarSelect', function()
{
	IsUserLogged();
	
	var carsList = [];	//Empty array
	
	//Checking for a pre-set cars list, if none->setting a new cars list
	if(localStorage.CarsList != undefined && localStorage.CarsList != '')
	{
		carsList = localStorage.getItem('CarsList');
		carsList = JSON.parse(carsList);
	}
	else
	{
		carsList = [
		{Maker:'Audi', Model:'S8',ID:'17-858-92',Gear:'Automatic', Available:true},
		{Maker:'BMW', Model:'740',ID:'12-130-22',Gear:'Manual', Available:true},
		{Maker:'Chevrolet', Model:'Camaro',ID:'72-441-31',Gear:'Manual', Available:true},
		{Maker:'Infiniti', Model:'G37x',ID:'56-684-05',Gear:'Automatic', Available:true},
		{Maker:'Volkswagen', Model:'Rabbit',ID:'23-250-87',Gear:'Manual', Available:true}];
		localStorage.setItem('CarsList', JSON.stringify(carsList));
	}
	
	//Emptying the list and refilling it with the current cars list
	$('#carsList').empty();
	for(var i in carsList)
	{
		if(carsList[i].Available)
		{
			$('#carsList').append('<li><a>'+carsList[i].Maker+' '+carsList[i].Model+'</a></li>');
		}
		else
		{
			$('#carsList').append('<li class="disabledLinks">'+carsList[i].Maker+' '+carsList[i].Model+'</li>');
		}
		
		//$('#CarSelect').trigger('pagecreate');
	}
	$('#carsList').append('<li id="continue" data-theme="b"><a>Continue</a></li>');
	$('#carsList').listview('refresh');
	
	//Canvas initialize
	var canvas01 = document.getElementById('carsCanvas');
	var context = canvas01.getContext('2d');
	context.fillStyle = 'white';
	
	if($('body').width()>1000)
	{
		canvas01.width = $('body').width()*0.8;
		canvas01.height = $('body').width()*0.4;
		
		$('#carsList').css('width','auto');
	}
	else
	{
		canvas01.width = $('body').width();
		canvas01.height = $('body').width()*0.5;
		
		$('#carsList').css('width','100%');
	}
	
	context.fillRect( 0,0, canvas01.width, canvas01.height);
	
	//Page arrangement for resizing, canvas needs to be set with javascript as well as css
	$(window).resize(function(){

		if($('body').width()>1000)
		{
			canvas01.width = $('body').width()*0.8;
			canvas01.height = $('body').width()*0.4;
			
			$('#carsList').css('width','auto');
		}
		else
		{
			canvas01.width = $('body').width();
			canvas01.height = $('body').width()*0.5;
			
			$('#carsList').css('width','100%');
		}
	
		context.drawImage(imageObj, 0,0, canvas01.width, canvas01.height);
	});
	
	var imageObj = new Image();
	var rotationIndex = 0;	//rotation between the images index
	var rotationPar = 0;	//parameter for increasing the delay between each rotation
	var rotation;	//timeout variable
	RotationFunc();
	function RotationFunc()
	{
		imageObj.src = FindRootFolder()+'sources/images/cars/'+carsList[rotationIndex].Maker+' '+carsList[rotationIndex].Model+'.jpg';
		
		if(rotationPar == 6){ rotationIndex++; rotationPar = 0;}	//rotationPar*500msec = 3000msec. 500msec are used so when the browser exits the page the rotation will stop after half a second (instead of 3 seconds).
		rotationPar++;
		rotationIndex = (rotationIndex>=carsList.length)? 0:rotationIndex;
		
		if(window.location.toString().indexOf('CarSelect') != -1)	//if the browser isn't on the carselect page, don't do the rotation again.
		{
			rotation = setTimeout(RotationFunc, 500);
		}
	}
	
	//Buttons
	var chosenCarVar;
	
	$('#carsList>li').on('vclick', function(e){
		
		if($(this).text().trim() == 'Continue')
		{
			if(chosenCarVar != undefined)
			{
				sessionStorage.setItem('chosenCar', JSON.stringify(chosenCarVar));
				$.mobile.navigate('#CostCalculation');
			}
		}
		else
		{
			for(var x in carsList)
			{
				if(carsList[x].Maker+' '+carsList[x].Model == $(this).text().trim())
				{
					chosenCarVar = carsList[x];
					DrawSpecs();
				}
			}
			
			$(this).siblings().removeClass('clicked');
			$(this).addClass('clicked');
			
			imageObj.src = FindRootFolder()+'sources/images/cars/'+chosenCarVar.Maker+' '+chosenCarVar.Model+'.jpg';
			clearTimeout(rotation);
		}
	});
	
	function DrawSpecs()	//function for drawing the specification of the car, used when a car is chosen by user (instead of shown with the rotation).
	{
		context.fillStyle = 'rgb(50,100,200)';
		context.strokeStyle = 'rgb(180,200,205)';
		var fontSize = Math.log($('body').width())*3.2;
		context.font = fontSize+'px Arial Bold';
		context.fillText('Manufacturer: '+chosenCarVar.Maker, fontSize, fontSize);
		context.strokeText('Manufacturer: '+chosenCarVar.Maker, fontSize, fontSize);
		
		context.fillText('Model: '+chosenCarVar.Model, fontSize, fontSize*2.5);
		context.strokeText('Model: '+chosenCarVar.Model, fontSize, fontSize*2.5);
		
		context.fillText('Plate Number: '+chosenCarVar.ID, fontSize, fontSize*4);
		context.strokeText('Plate Number: '+chosenCarVar.ID, fontSize, fontSize*4);
		
		context.fillText('Gear: '+chosenCarVar.Gear, fontSize, fontSize*5.5);
		context.strokeText('Gear: '+chosenCarVar.Gear, fontSize, fontSize*5.5);
	}
	
	imageObj.onload = function()
	{
		context.drawImage(imageObj, 0,0, canvas01.width, canvas01.height);
		if(chosenCarVar != undefined) DrawSpecs();
	}
});



/*--------------------------------------------------*/
/*|||---|||---CostCalculation functions---|||---|||*/
/*--------------------------------------------------*/
$(document).on('pageshow','#CostCalculation', function()
{	
	$('#acceptCost').button('disable');
	$('#cost').text('');
	$('#animGif').attr('src', 'sources/images/anim.gif');
	$('#animGif').css('opacity', '0');
	
	var map;
	var marker;
	
	if(IsUserLogged())	//first checks if the user is logged, and only after checks if a car has been selected.
	{
		if(sessionStorage.chosenCar == undefined || sessionStorage.chosenCar == '')
		{
			alert('Please select a car before continuing');
			$.mobile.navigate('#CarSelect');
		}
		else
		{
			navigator.geolocation.getCurrentPosition(showLocation, locationErrorsHandler);
		}
	}
	
	//Showing the approximate location of the user
	function showLocation(position)
	{
		var posLatLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
		
		var mapOptions = {
			center: posLatLng,
			zoom: 15,
			mapTypeId: google.maps.MapTypeId.ROADMAP,
			unitSystem: google.maps.UnitSystem.METRIC 
			};
			
		map = new google.maps.Map(document.getElementById("gMap"),
			mapOptions);
		marker = new google.maps.Marker({
			position: mapOptions.center,
			animation:google.maps.Animation.DROP});
		marker.setMap(map);
		
	    var geocoder = new google.maps.Geocoder();
		geocoder.geocode({'latLng': posLatLng}, function(results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                if (results[0]) {
                    var loc = results[0].formatted_address;
					$('#start').val(loc);
                }
            }
			else
			{
				$('#start').val(posLatLng);
			}
        });
	}
	
	function locationErrorsHandler(error)
	{
		switch(error.code)
		{
			case 0:
				alert('Unknown error has occurred, please contact NASA.');
				break;
			case 1:
				alert('Permission denied by user, please refresh the page and allow location sharing to continue.');
				break;
			case 2:
				alert('Position unavailable at this moment, please try again later.');
				break;
			case 3:
				alert('Timeout error, please check your internet connection and try again.');
				break;
		}
	}

	$('#calc').on('vclick', function()
	{
		var start = $('#start').val();
		var end = $('#end').val();
		calcRoute(start, end)
	});
	
	var calcWorker;
	
	if(typeof(Worker) !== "undefined")	//webWorker detection
	{
	  if(typeof(calcWorker) == "undefined")
		{
			calcWorker = new Worker("sources/js/costCalculator.js");
		}
		calcWorker.onmessage = function (event)
		{
			$('#cost').text("Cost: " +event.data+" Shekels");
			
			sessionStorage.setItem('Cost',event.data);
			$('#acceptCost').button('enable');
			workerAnimation('stop');
		};
	}
	else
	{
		alert("Update your browser to support Web Workers");
	}
	
	//Calculation Promo
	function workerAnimation(action)
	{
		switch (action)
		{
			case 'go':
				$('#animGif').css('opacity', '1');
				sound.volume = 0.5
				sound.play();
				break;
			case 'stop':
				$('#animGif').css('opacity', '0');
				while(sound.volume > 0.1)
				{
					sound.volume *= 0.8;
				}
				sound.pause();
				break;
		}
	}
	
	var directionsService = new google.maps.DirectionsService();
	var directionsDisplay = new google.maps.DirectionsRenderer();
	var sound = new Audio('sources/audio/ElevatorMusic.mp3');
	
	function calcRoute(start, end)
	{
		directionsDisplay.setMap(map);
		directionsDisplay.setPanel(document.getElementById("directionsPanel"));
	
		var request = {
			origin:start,
			destination:end,
			travelMode: google.maps.TravelMode.DRIVING
			};
			
		directionsService.route(request, function(result, status) {
			if (status == google.maps.DirectionsStatus.OK) {
				directionsDisplay.setDirections(result);
				//webWorker
				workerAnimation('go');
				sound.volume = 0.5;
				calcWorker.postMessage({'distance':result.routes[0].legs[0].distance.value, 'chosenCar':JSON.parse(sessionStorage.chosenCar)});
				marker.setMap(null);
			}
			else {
				alert('An error has occurred while calculating your route');
			}
		});
	}
	
	$('#acceptCost').on('vclick', function(e)
	{
		e.stopPropagation();
		var chosenCarVar = JSON.parse(sessionStorage.chosenCar);
		var carsList = JSON.parse(localStorage.CarsList);
		if(sessionStorage.Cost != undefined)
		{
			$('#popup').popup();
			$('#popup').popup('open');
			$('#popup #p1').text('You have successfully rented '+chosenCarVar.Maker+' '+chosenCarVar.Model+' (plate number: '+chosenCarVar.ID +') for '+sessionStorage.Cost+' shekels!');
			
			setTimeout(function(){Redirect(20, 2)},500);
			function Redirect(index, dotsNum)
			{
				var str = 'Redirecting to next page in ';
				str += Math.round(index/4);
				
				for(var i=(3-dotsNum); i>0; i--)
				{
					str+='.';
				}
				
				$('#popup #p2').text(str);
				
				dotsNum--;
				if(dotsNum<0) dotsNum = 3;
				
				index--;
				if(index>1) setTimeout(function(){Redirect(index, dotsNum)},250);
			}			
			
			for(var x in carsList)
			{
				if(carsList[x].ID == chosenCarVar.ID)
				{
					carsList[x].Available = false;
					localStorage.setItem('CarsList', JSON.stringify(carsList));
				}
			}
			
			setTimeout(function(){$.mobile.navigate('#CarReturning')}, 5500);
			calcWorker.terminate();
		}
		else
		{
			alert('Cost not defined error');
		}
	});
});



/*----------------------------------------------*/
/*|||---|||---CarReturning functions---|||---|||*/
/*----------------------------------------------*/

$(document).on('pageshow','#CarReturning', function()
{	
	IsUserLogged();
	
	var carsList = JSON.parse(localStorage.CarsList);
	var validNumber = false;
	
	$('#returnButton').on('vclick', function(e){
		for(var i in carsList)
		{
			if(carsList[i].ID.toString() == $('#returnPlateNumber').val().trim().toString() && carsList[i].Available == false)
			{
				validNumber = true;
				carsList[i].Available = true;
				alert('You have returned the vehicle successfully! Thank you for choosing Zepto Car Rental!');
				localStorage.setItem('CarsList', JSON.stringify(carsList));
				$.mobile.navigate('#HomePage');
			}
		}
		
		if(!validNumber)
		{
			alert('Error, wrong plate number');
		}
		e.stopPropagation();
	});
});
function initMap(lat, lng) {
	var map;
	map = new google.maps.Map(document.getElementById('map'), {
		center: {lng: lng , lat: lat},
		zoom: 15,
		// customize controls
		mapTypeControl: false,
		panControl: false,
		streetViewControl: false,
		zoomControl: false
	});

	createMarker({lng: lng , lat: lat}, 'hello World', map);
}

function createMarker(position, title, map) {
	var marker = new google.maps.Marker({
		position: position,
		title: title,
		map: map
	});
}

function getLocation() {
	return new Promise(function (resolve, reject){
		var currentLocation = {};
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(function showPosition(position) {
				currentLocation.currentPositionLatitude =  position.coords.latitude;
				currentLocation.currentPositionLongitude = position.coords.longitude;
				resolve(currentLocation);
			}, function showError(error) {
				switch(error.code) {
					case error.PERMISSION_DENIED:
					currentLocation.error=  "User denied the request for Geo-location."
					reject(currentLocation);
					break;
					case error.POSITION_UNAVAILABLE:
					currentLocation.error= "Location information is unavailable."
					reject(currentLocation);
					break;
					case error.TIMEOUT:
					reject(currentLocation);
					currentLocation.error= "The request to get user location timed out."
					reject(currentLocation);
					break;
					case error.UNKNOWN_ERROR:
					currentLocation.error= "An unknown error occurred."
					reject(currentLocation);
					break;
				}
			});

		} else {
			reject("Geo location is not supported by this browser.");
		}
	});
}
function getLLL (){
	if(('Promise' in window)){
		var lat, lng ;
		getLocation().then(function(value){
			lat = value.currentPositionLatitude;
			lng = value.currentPositionLongitude;
			console.log(lat, lng);
			initMap(lat,lng);
		}).catch(function(error){
			console.log(error.error);
			lat= 33.8886;
			lng= 35.4955;
			initMap(lat,lng);
		});
	}else{
	}
}
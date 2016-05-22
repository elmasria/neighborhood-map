var foursquareClientID = '&oauth_token=CRE2N2IININ300LAW02N4R5BCL3NP1X1A14JERVXK3B4KUBN&v=20151229';
var foursquareUrl = 'https://api.foursquare.com/v2/venues/search?ll=';

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

function getLocationSync() {
	var currentLocation = {};
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function showPosition(position) {
			currentLocation.currentPositionLatitude =  position.coords.latitude;
			currentLocation.currentPositionLongitude = position.coords.longitude;
		}, function showError(error) {
			switch(error.code) {
				case error.PERMISSION_DENIED:
				currentLocation.error=  "User denied the request for Geo-location."
				break;
				case error.POSITION_UNAVAILABLE:
				currentLocation.error= "Location information is unavailable."
				break;
				case error.TIMEOUT:
				reject(currentLocation);
				currentLocation.error= "The request to get user location timed out."
				break;
				case error.UNKNOWN_ERROR:
				currentLocation.error= "An unknown error occurred."
				break;
			}
		});

	} else {
		currentLocation.error = "Geo location is not supported by this browser.";
	}
	return currentLocation;
}

/* Checks if a substring `other` is found inside the string */
String.prototype.contains = function(other) {
	return this.indexOf(other) !== -1;
};

function AppViewModel() {
	var controller = this,
	mapCenter = {};
	controller.filterText = ko.observable('');
	controller.allMArkers = ko.observableArray([]);

	controller.animateMarker = function(marker) {
		marker.toggleBounce();
		marker.openInfoWindow();
	}

	controller.filterMarkerList = ko.computed(function() {

		controller.allMArkers().forEach(function(marker) {
			marker.clearMarker();
		});

		// filter listResults where name contains `controller.allMArkers`
		var listResults = ko.utils.arrayFilter(controller.allMArkers(), function(marker) {
			return marker.title().toLowerCase().contains(controller.filterText().toLowerCase());
		});

		listResults.forEach(function(marker) {
			marker.createMarker();
		});

		return listResults;
	});

	if(('Promise' in window)){
		getLocation().then(function(value){
			mapCenter.lat = value.currentPositionLatitude;
			mapCenter.lng = value.currentPositionLongitude;
			createMap();
		}).catch(function(error){
			mapCenter.lat= 33.8886;
			mapCenter.lng= 35.4955;
			createMap();
		});
	}else{
		if (getLocationSync.error === "") {
			mapCenter.lat = getLocationSync.currentPositionLatitude;
			mapCenter.lng = getLocationSync.currentPositionLongitude
		}else{
			mapCenter.lat= 33.8886;
			mapCenter.lng= 35.4955;
		}
		createMap();
	}

	function createMap() {
		var location = mapCenter.lat + "," + mapCenter.lng,
		url = foursquareUrl + location  + foursquareClientID,
		mp = new Map('map',
			mapCenter,
			17,
			false,
			false,
			false,
			false);

		$.getJSON( url, function(data) {
			console.log( data.response.venues);
			var response = data.response.venues;
			for(var i = 0; i < response.length ;i++){
				var markerPosition = {};
				markerPosition.lat = response[i].location.lat,
				markerPosition.lng = response[i].location.lng,
				summary = response[i].name;

				var mrk = new Marker(markerPosition,
					summary,
					mp.map,
					'./images/beachflag.png',
					{title: summary});
				controller.allMArkers.push(mrk);
			}
		})
		.fail(function(error) {
			console.log( "error" );
			var mrk = new Marker(mapCenter,
				"Current Location",
				mp.map,
				'./images/beachflag.png',
				{});
		});

	}
}




function init() {
	ko.applyBindings(new AppViewModel());
}
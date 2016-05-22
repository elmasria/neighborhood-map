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



function AppViewModel() {
	var controller = this,
	mapCenter = {};
	controller.filterText = ko.observable(""); 
	controller.allMArkers = ko.observableArray();

	controller.updateList = function () {
		console.log(controller.filterText.value);
	}

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
			13,
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
					'google.maps.Animation.DROP',
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
				'google.maps.Animation.DROP',
				mp.map,
				'./images/beachflag.png',
				{});
		})

	}
}


// Map Class
function Map(targetDiv, centrObj, zoom, mapTypeControl, panControl, streetViewControl, zoomControl) {
	var self = this;
	self.map;
	self.center =  centrObj;
	self.zoom= zoom;
	self.mapTypeControl= mapTypeControl;
	self.panControl= panControl;
	self.streetViewControl= streetViewControl;
	self.zoomControl= zoomControl;
	self.targetDiv = targetDiv;

	// generate map
	self.createMap();
}

// Create map
Map.prototype.createMap = function() {
	var self = this;
	self.map = new google.maps.Map(document.getElementById(self.targetDiv), {
		center: self.center,
		zoom: self.zoom,
		mapTypeControl: self.mapTypeControl,
		panControl: self.panControl,
		streetViewControl: self.streetViewControl,
		zoomControl: self.zoomControl
	});
};

// Marker class
function Marker(position, title, animation, map, icon, contentObj) {
	var self = this;
	self.position = position;
	self.title = title;
	self.animation = animation;
	self.map = map;
	self.icon = icon;
	self.contentObj = contentObj;

	// generate marker
	self.createMarker();

}

// create marker
Marker.prototype.createMarker = function createMarker() {
	var self = this,
	marker = new google.maps.Marker({
		position: self.position,
		title: self.title,
		animation: self.animation,
		map: self.map,
		icon: self.icon,
	});

	marker.addListener('click', function(){
		self.toggleBounce(marker)
	});

	self.generateInfoWindow(marker, self.map, self.contentObj);
	return marker;
}

// set or remove animation
Marker.prototype.toggleBounce = function (marker) {
	if (marker.getAnimation() !== null) {
		marker.setAnimation(null);
	} else {
		marker.setAnimation(google.maps.Animation.BOUNCE);
	}
}

// generate info window
Marker.prototype.generateInfoWindow = function(marker, map ,contentObj) {
	var contentDiv = $('<div></div>',{
		class: 'content-div',
		html: contentObj.title
	});

	var infowindow = new google.maps.InfoWindow({
		content: contentDiv[0]
	});

	marker.addListener('click', function() {
		infowindow.open(map, marker);
	});
};

function init() {
	ko.applyBindings(new AppViewModel());
}

// Marker class
var Marker = function (position, title, map, icon, contentObj) {
	var self = this;
	self.position = ko.observable(position);
	self.title = ko.observable(title);
	self.animation = ko.observable(null);
	self.map = ko.observable(map);
	self.icon = ko.observable(icon);
	self.contentObj = ko.observable(contentObj);
	self.marker = ko.observable();
	self.infowindow = ko.observable();

	// generate marker
	self.createMarker();

}

// create marker
Marker.prototype.createMarker = function createMarker() {
	var self = this;
	self.marker = new google.maps.Marker({
		position: self.position(),
		title: self.title(),
		animation: self.animation(),
		map: self.map(),
		icon: self.icon(),
	});

	self.marker.addListener('click', function(){
		self.toggleBounce()
	});

	self.generateInfoWindow(self.contentObj());
	return self.marker;
}

// set or remove animation
Marker.prototype.toggleBounce = function () {
	var self= this;
	if (self.marker.getAnimation() !== null) {
		self.marker.setAnimation(null);
	} else {
		self.marker.setAnimation(google.maps.Animation.BOUNCE);
	}
}

// generate info window
Marker.prototype.generateInfoWindow = function(contentObj) {
	var self= this,
		contentDiv = $('<div></div>',{
		class: 'content-div',
		html: contentObj.title
	});

	self.infowindow = new google.maps.InfoWindow({
		content: contentDiv[0]
	});

	self.marker.addListener('click', function() {
		self.infowindow.open(self.map(), self.marker);
	});
};

Marker.prototype.openInfoWindow = function() {
	var self = this;
	self.infowindow.open(self.map(), self.marker);
};

// clear Marker
Marker.prototype.clearMarker = function() {
	var self = this;
	self.marker.setMap(null);
};

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

};

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
};

// set or remove animation
Marker.prototype.toggleBounce = function () {
	var self= this;

	app.getMarkerList().forEach(function(markerc) {
		if (self.marker != markerc.marker) {
			markerc.marker.setAnimation(null);
		}
	});

	self.marker.getAnimation() !== null ? self.marker.setAnimation(null):self.marker.setAnimation(google.maps.Animation.BOUNCE);

};

// generate info window
Marker.prototype.generateInfoWindow = function(contentObj) {
	var self= this,
	linkUrl = contentObj.url || '#',
	linkShow = contentObj.url || 'N/A',
	contentDiv = '<div class="content-div">' +
					'<h4 class="title-header">'+contentObj.title+'</h4>' +
					'<div class="body-div">' +
						'<div class="element-div"><span>Address: </span>'+contentObj.address+'</div>' +
						'<div class="element-div"><span>Category: </span>'+contentObj.category+'</div>' +
						'<div class="element-div"><span>Checkin #: </span>'+contentObj.checkinsCount+'</div>' +
						'<div class="element-div"><span>' +contentObj.summary + '</span></div>' +
						'<div class="element-div"><span>Link: </span><a target="_blank" href="'+ linkUrl +'">' + linkShow + '</a></div>' +
					'</div>' +
				'</div>';
	self.infowindow = new google.maps.InfoWindow();
	self.infowindow.setContent(contentDiv);
	self.marker.addListener('click', function() {
		self.openInfoWindow();
	});
};

Marker.prototype.openInfoWindow = function() {
	var self = this;
	app.getMarkerList().forEach(function(markerc) {
		if (self.marker != markerc.marker) {
			markerc.infowindow.close();
		}
	});
	self.infowindow.open(self.map(), self.marker);
};

// clear Marker
Marker.prototype.clearMarker = function() {
	var self = this;
	self.marker.setVisible(false); //setMap(null);
};

// show marker
Marker.prototype.showMarker = function() {
	var self = this;
	self.marker.setVisible(true);
};

// Map Class
var Map = function (targetDiv, centrObj, zoom, mapTypeControl, panControl, streetViewControl, zoomControl) {
	var self = this;
	self.map ;
	self.center =  ko.observable(centrObj);
	self.zoom= ko.observable(zoom);
	self.mapTypeControl= ko.observable(mapTypeControl);
	self.panControl= ko.observable(panControl);
	self.streetViewControl= ko.observable(streetViewControl);
	self.zoomControl= ko.observable(zoomControl);
	self.targetDiv = ko.observable(targetDiv);

	// generate map
	self.createMap();
};

// Create map
Map.prototype.createMap = function() {
	var self = this;
	self.map = new google.maps.Map(document.getElementById(self.targetDiv()), {
		center: self.center(),
		zoom: self.zoom(),
		mapTypeControl: self.mapTypeControl(),
		panControl: self.panControl(),
		streetViewControl: self.streetViewControl(),
		zoomControl: self.zoomControl()
	});
};
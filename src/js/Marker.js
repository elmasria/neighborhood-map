
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
		class: 'content-div'
	}),
	titleHeader = $('<h4></h4>',{
		class: 'title-header',
		html: contentObj.title
	}),
	bodyDiv = $('<div></div>', {
		class: 'body-div'
	})
	addressDiv = $('<div></div>', {
		class: 'element-div',
		html: '<span>Address: </span>' + contentObj.address
	}),
	categoryDiv = $('<div></div>', {
		class: 'element-div',
		html: '<span>Category: </span>' + contentObj.category
	}),
	checkinsCountsDiv = $('<div></div>', {
		class: 'element-div',
		html: '<span>Checkin #: </span>' + contentObj.checkinsCount
	}),
	summaryDiv = $('<div></div>', {
		class: 'element-div',
		html:  contentObj.summary
	}),
	linkUrl = contentObj.url || '#',
	linkShow = contentObj.url || 'N/A',
	urlDiv = $('<div></div>', {
		class: 'element-div',
		html: '<span>Link: </span><a target="_blank" href="'+ linkUrl +'">' + linkShow + '</a>'
	});

	bodyDiv.append(addressDiv);
	bodyDiv.append(categoryDiv);
	bodyDiv.append(checkinsCountsDiv);
	bodyDiv.append(summaryDiv);
	bodyDiv.append(urlDiv);

	contentDiv.append(titleHeader);
	contentDiv.append(bodyDiv);

	self.infowindow = new google.maps.InfoWindow({
		content: contentDiv[0]
	});

	self.marker.addListener('click', function() {
		self.openInfoWindow();
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
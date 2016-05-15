var map;
function initMap() {
	map = new google.maps.Map(document.getElementById('map'), {
		center: {lat: 33.8886, lng: 35.4955},
		zoom: 15,
		// customize controls
		mapTypeControl: false,
		panControl: false,
		streetViewControl: false,
		zoomControl: false
	});
}
var map;
var service;
var infoWindow;

initMap();

function initMap() {
	var tls = new google.maps.LatLng(43.6006171, 1.4464716);
	infoWindow = new google.maps.InfoWindow();
	map = new google.maps.Map(document.getElementById('map'), {center: tls, zoom: 13.5});
}


var map;
var service;
var infowindow;

initMap();
initAutocomplete();

function initMap() {
	var tls = new google.maps.LatLng(43.6006171, 1.4464716);

	infowindow = new google.maps.InfoWindow();

	map = new google.maps.Map(
			document.getElementById('map'), {center: tls, zoom: 13.5});

	// var request = {
	// 	query: 'Restaurant Toulouse',
	// 	fields: ['name', 'geometry'],
	// };

	// var service = new google.maps.places.PlacesService(map);

	// service.findPlaceFromQuery(request, function(results, status) {
	// 	if (status === google.maps.places.PlacesServiceStatus.OK) {
	// 		if(results.length === 0) { 
	// 			console.log('no result'); 
	// 		} else {
	// 			console.log(results.length);
	// 			for (var i = 0; i < results.length; i++) {
	// 				createMarker(results[i]);
	// 				console.log(results[i]);
	// 			}
	// 			map.setCenter(results[0].geometry.location);
	// 			map.setZoom(18);

	// 		}
	// 	}
	// });
}

function createMarker(place) {
	var marker = new google.maps.Marker({
		map: map,
		position: place.geometry.location
	});

	// google.maps.event.addListener(marker, 'click', function() {
	// 	infowindow.setContent(place.name);
	// 	infowindow.open(map, this);
	// });
}



function initAutocomplete() {

    // Create the search box and link it to the UI element.
    var input = document.getElementById('pac-input');
    var searchBox = new google.maps.places.SearchBox(input);
    // map.controls[google.maps.ControlPosition.TOP].push(input);

    // Bias the SearchBox results towards current map's viewport.
    map.addListener('bounds_changed', function() {
      searchBox.setBounds(map.getBounds());
    });

    var markers = [];
    // Listen for the event fired when the user selects a prediction and retrieve
    // more details for that place.
    searchBox.addListener('places_changed', function() {
      var places = searchBox.getPlaces();

      if (places.length == 0) {
        return;
      }

      // Clear out the old markers.
      markers.forEach(function(marker) {
        marker.setMap(null);
      });
      markers = [];

      // For each place, get the icon, name and location.
      var bounds = new google.maps.LatLngBounds();
      places.forEach(function(place) {
        if (!place.geometry) {
          console.log("Returned place contains no geometry");
          return;
        }
        var icon = {
          url: place.icon,
          size: new google.maps.Size(71, 71),
          origin: new google.maps.Point(0, 0),
          anchor: new google.maps.Point(17, 34),
          scaledSize: new google.maps.Size(25, 25)
        };

        // Create a marker for each place.
        markers.push(new google.maps.Marker({
          map: map,
          icon: icon,
          title: place.name,
          position: place.geometry.location
        }));

        if (place.geometry.viewport) {
          // Only geocodes have viewport.
          bounds.union(place.geometry.viewport);
        } else {
          bounds.extend(place.geometry.location);
        }
      });
      map.fitBounds(bounds);
    });
}

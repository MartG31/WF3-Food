"use strict";

// https://maps.googleapis.com/maps/api/place/textsearch/xml?query=restaurant+toulouse&

// WF3-food key=AIzaSyAUqogljBCOIKf9KKI98L4mPJUdaF-_V3k
// histo-carto key=AIzaSyCEKxl41ov7xsReO1fCJOWokqXMBGGRgUk
// histo-carto new key=AIzaSyDpIrYXtVYZFRFY0SVdY1MyKgZO96iN9nM
// axel key=AIzaSyBzwf88gItmvWmzXU8rNYs9mP-PbGwdg7E
// axel new key=AIzaSyBq1U1sm0HowdX6ndei9MZabaMBi7qNZqU



$(document).ready(function(){

	$("#search-form").submit(function(e) {

		e.preventDefault();

		var seachQuery = $('#searchRest').val();
		console.log('Nouvelle requête à envoyer : '+seachQuery);

		if(seachQuery.length > 0) {

			googlePlacesQuery(seachQuery, 'https://maps.googleapis.com/maps/api/place/textsearch/json');
		}
	});


	function googlePlacesQuery(req, url) {

		var dataParams = {
			url: url, // URL de l'API Google
			key: "AIzaSyBq1U1sm0HowdX6ndei9MZabaMBi7qNZqU", // Nouvelle clé d'api
			query: req, // Requete
		}

		$.ajax({
			url: 'https://axessweb.io/api/google', // URL de mon serveur pour outrepasser les restrictions Google, ne pas modifier.
			type: 'GET',
			data: dataParams, 
			success: function(json){
				console.log('success');
				console.log(json);

				console.log(json);
				console.log(json.results);
				console.log(json.results.length);

				for (var i=0; i<json.results.length; i++) {
					var currentRes = json.results[i];

					console.log('----------');
					console.log(currentRes.name);
					console.log(currentRes.formatted_address);

				}
			},
			error: function(json){
				console.log('error');
				console.log(json);
			}
		});
	}

	// });

	// var query = "restaurant+saint+lys";
	// var apiKey = "AIzaSyDpIrYXtVYZFRFY0SVdY1MyKgZO96iN9nM";

	// $.ajax({
	// 	url: "https://maps.googleapis.com/maps/api/place/textsearch/xml?query=" + query + "&key=" + apiKey,
	// 	type: "GET",
	// 	dataType: "json",
	// 	headers: {	"Access-Control-Allow-Credentials": "true",
	// 				"Access-Control-Allow-Origin": "localhost"},

	// 	success: function(json) {

	// 		console.log(json);
	// 	},

	// 	error: function() {
	// 		console.log('ajax-error');
	// 	}
	// });

	// $.getJSON("https://maps.googleapis.com/maps/api/place/textsearch/xml?query=" + query + "&key=" + apiKey, function(data) {

	// 	console.log(data);

	// });

});






// Access to XMLHttpRequest at 
// 'https://maps.googleapis.com/maps/api/place/textsearch/xml?query=restaurant+saint+lys&key=AIzaSyCEKxl41ov7xsReO1fCJOWokqXMBGGRgUk'
//  from origin 
//  'http://localhost' 
//  has been blocked by CORS policy: No 
//  'Access-Control-Allow-Origin' header is present on the requested resource.
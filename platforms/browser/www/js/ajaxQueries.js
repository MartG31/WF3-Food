"use strict";

// https://maps.googleapis.com/maps/api/place/textsearch/json?query=restaurant+toulouse&

// WF3-food key=AIzaSyAUqogljBCOIKf9KKI98L4mPJUdaF-_V3k
// histo-carto1 key=AIzaSyCEKxl41ov7xsReO1fCJOWokqXMBGGRgUk
// histo-carto2 key=AIzaSyDpIrYXtVYZFRFY0SVdY1MyKgZO96iN9nM
// axel1 key=AIzaSyBzwf88gItmvWmzXU8rNYs9mP-PbGwdg7E
// axel2 key=AIzaSyBq1U1sm0HowdX6ndei9MZabaMBi7qNZqU


$(document).ready(function(){

	// BARRE DE RECHERCHE

	$("#search-form").submit(function(e) {

		e.preventDefault();

		var query = $('#searchRest').val();
		console.log('Nouvelle requête à envoyer : '+query);

		if(query.length > 0) {

			searchQuery(query);

			$('.app').animate({scrollTop: $("#pagetwo").offset().top}, 'slow');
		}
	});

	// GOOGLE PLACES API QUERIES

	const axKey = 'AIzaSyBq1U1sm0HowdX6ndei9MZabaMBi7qNZqU';
	const axUrl = 'https://axessweb.io/api/google';

	// 
	// 
	// 
	function searchQuery(req) {

		var dataParams = {
			url: 'https://maps.googleapis.com/maps/api/place/textsearch/json', // URL de l'API Google
			key: axKey, // Nouvelle clé d'api
			query: req // Requete
		}

		$.ajax({
			url: axUrl, // URL de mon serveur pour outrepasser les restrictions Google, ne pas modifier.
			type: 'GET',
			data: dataParams, 
			success: function(json){
				console.log("search success ("+json.results.length+")");
				console.log(json);

				// on vide la liste
				var answers = $("#answers-content");
				answers.html("");

				// on parcourt les réponses
				for (var i=0; i<json.results.length; i++) {

					var currentRes = json.results[i];

					// création de l'item
					var vignette = $("<div></div>").addClass("list-item")
					.data("placeid", currentRes.place_id)
					.data("locLat", currentRes.geometry.location.lat)
					.data("locLng", currentRes.geometry.location.lng);



						var fig = $("<figure></figure>").addClass("item-fig");

						if(currentRes.photos && currentRes.photos.length > 0) {
							var img = $("<img>").addClass("item-img img-fluid");
							photoQuery(currentRes.photos[0].photo_reference, img);
							fig.append(img);
						}
								
						var name = $("<div></div>").addClass("item-name").html(currentRes.name);
						var address = $("<div></div>").addClass("item-address").html(currentRes.formatted_address);

						var rating = $("<div></div>").addClass("item-rating");
							var rating_note = $("<span></span>").addClass("rating-note").html('<i style="color:#ffdf39" class="fas fa-star"></i> '+currentRes.rating);

							var total_ratings = $("<span></span>").addClass("total-ratings").html(" ("+currentRes.user_ratings_total+")");
						rating.append(rating_note);
						rating.append(total_ratings);


					// vignette build
					vignette.append(fig);
					vignette.append(name);
					vignette.append(address);
					vignette.append(rating);

					// ajout à la liste
					answers.append(vignette);
					detailsQuery(vignette);
				}
			},
			error: function(error){
				console.log('search error');
			}
		});

	}

	// 
	// 
	// 
	function photoQuery(ref, item) {

		var dataParams = {
			url: 'https://maps.googleapis.com/maps/api/place/photo',
			key: axKey,
			photoreference: ref,
			maxheight: '400'
		}

		$.ajax({
			url: axUrl,
			type: 'GET',
			data: dataParams, 
			success: function(rep){
				console.log("photo success");
				console.log(rep);
				console.log(item);
				// item.attr("src", rep);
			},
			error: function(error){
				console.log('photo error');
				console.log(error);
			}
		});

	}
	
	// 
	//
	// 
	function detailsQuery(item) {

		// var pid = item.data("placeid");

		var dataParams = {
			url: 'https://maps.googleapis.com/maps/api/place/details/json',
			key: axKey,
			placeid: item.data("placeid")
		}

		$.ajax({
			url: axUrl,
			type: 'GET',
			data: dataParams, 
			success: function(rep){
				console.log("details success");
				console.log(item.data("placeid"));
				console.log(rep);

				var details = rep.result;
				var tel = $("<div></div>").addClass("item-tel").html("<a href='tel:" + details.international_phone_number + "'>"+ details.formatted_phone_number+"</a>");
				//avec le "phoneto" http://www.nicolasaguenot.com/nicoandco/index.php?post/2011/06/16/Quel-est-le-code-html-pour-appeler-un-num%C3%A9ro-de-t%C3%A9l%C3%A9phone

				var web = $("<div></div>").addClass("item-web").text("Website : " + details.website);

				var toMap = $("<a></a>").addClass("toMap").attr("href", "#pagethree").text("Carte").data({	"transition": "slide",
																											"direction": "reverse"
																									});
				var toDetails = $("<a></a>").addClass("toDetails").attr("href", "#pagefour").text("Details").data("transition", "slide");

				item.append(tel);
				item.append(web);
				item.append(toMap);
				item.append(toDetails);

				toDetails.click(function() {

					var detailsPage = $("#details-content").html("");

					detailsPage.append(item);

					var content = $("<div></div>").addClass("content");

					var ouvert;
					if(details.opening_hours.open_now) {
						ouvert = "<b>Ouvert</b>";
					} else {
						ouvert = "<i>Fermé</i>";
					}
					content.append($("<div></div>").html("Ouvert aujourd'hui : "+ouvert));
					content.append($("<div></div>").html("<div>Horaires d'ouverture :</div>"+details.opening_hours.weekday_text));

					var reviews = $("<div></div>").addClass("reviews");
					for(var i=0;i<details.reviews.length;i++) {
						var rev = $("<div></div>").addClass("rev-item").html("<hr><b>"+details.reviews[i].author_name + "</b><br><i>(Note = "+ details.reviews[i].rating + ")</i><br>"+details.reviews[i].text)+"<br>";
						reviews.append(rev);
					}
					content.append(reviews);

					detailsPage.append(content);

				});
			},
			error: function(error){
				console.log('details error');
			}
		});
	}
});"use strict";

// https://maps.googleapis.com/maps/api/place/textsearch/json?query=restaurant+toulouse&

// WF3-food key=AIzaSyAUqogljBCOIKf9KKI98L4mPJUdaF-_V3k
// histo-carto1 key=AIzaSyCEKxl41ov7xsReO1fCJOWokqXMBGGRgUk
// histo-carto2 key=AIzaSyDpIrYXtVYZFRFY0SVdY1MyKgZO96iN9nM
// axel1 key=AIzaSyBzwf88gItmvWmzXU8rNYs9mP-PbGwdg7E
// axel2 key=AIzaSyBq1U1sm0HowdX6ndei9MZabaMBi7qNZqU


$(document).ready(function(){

	// BARRE DE RECHERCHE

	$("#search-form").submit(function(e) {

		e.preventDefault();

		var query = $('#searchRest').val();
		console.log('Nouvelle requête à envoyer : '+query);

		if(query.length > 0) {

			searchQuery(query);

			$('.app').animate({scrollTop: $("#pagetwo").offset().top}, 'slow');
		}
	});

	// GOOGLE PLACES API QUERIES

	const axKey = 'AIzaSyBq1U1sm0HowdX6ndei9MZabaMBi7qNZqU';
	const axUrl = 'https://axessweb.io/api/google';

	// 
	// 
	// 
	function searchQuery(req) {

		var dataParams = {
			url: 'https://maps.googleapis.com/maps/api/place/textsearch/json', // URL de l'API Google
			key: axKey, // Nouvelle clé d'api
			query: req // Requete
		}

		$.ajax({
			url: axUrl, // URL de mon serveur pour outrepasser les restrictions Google, ne pas modifier.
			type: 'GET',
			data: dataParams, 
			success: function(json){
				console.log("search success ("+json.results.length+")");
				console.log(json);

				// on vide la liste
				var answers = $("#answers-content");
				answers.html("");

				// on parcourt les réponses
				for (var i=0; i<json.results.length; i++) {

					var currentRes = json.results[i];

					// création de l'item
					var vignette = $("<div></div>").addClass("list-item")
					.data("placeid", currentRes.place_id)
					.data("locLat", currentRes.geometry.location.lat)
					.data("locLng", currentRes.geometry.location.lng);



						var fig = $("<figure></figure>").addClass("item-fig");

						if(currentRes.photos && currentRes.photos.length > 0) {
							var img = $("<img>").addClass("item-img img-fluid");
							photoQuery(currentRes.photos[0].photo_reference, img);
							fig.append(img);
						}
								
						var name = $("<div></div>").addClass("item-name").html(currentRes.name);
						var address = $("<div></div>").addClass("item-address").html(currentRes.formatted_address);

						var rating = $("<div></div>").addClass("item-rating");
							var rating_note = $("<span></span>").addClass("rating-note").html('<i style="color:#ffdf39" class="fas fa-star"></i> '+currentRes.rating);

							var total_ratings = $("<span></span>").addClass("total-ratings").html(" ("+currentRes.user_ratings_total+")");
						rating.append(rating_note);
						rating.append(total_ratings);


					// vignette build
					vignette.append(fig);
					vignette.append(name);
					vignette.append(address);
					vignette.append(rating);

					// ajout à la liste
					answers.append(vignette);
					detailsQuery(vignette);
				}
			},
			error: function(error){
				console.log('search error');
			}
		});

	}

	// 
	// 
	// 
	function photoQuery(ref, item) {

		var dataParams = {
			url: 'https://maps.googleapis.com/maps/api/place/photo',
			key: axKey,
			photoreference: ref,
			maxheight: '400'
		}

		$.ajax({
			url: axUrl,
			type: 'GET',
			data: dataParams, 
			success: function(rep){
				console.log("photo success");
				console.log(rep);
				console.log(item);
				// item.attr("src", rep);
			},
			error: function(error){
				console.log('photo error');
				console.log(error);
			}
		});

	}
	
	// 
	//
	// 
	function detailsQuery(item) {

		// var pid = item.data("placeid");

		var dataParams = {
			url: 'https://maps.googleapis.com/maps/api/place/details/json',
			key: axKey,
			placeid: item.data("placeid")
		}

		$.ajax({
			url: axUrl,
			type: 'GET',
			data: dataParams, 
			success: function(rep){
				console.log("details success");
				console.log(item.data("placeid"));
				console.log(rep);

				var details = rep.result;
				var tel = $("<div></div>").addClass("item-tel").html("<a href='tel:" + details.international_phone_number + "'>"+ details.formatted_phone_number+"</a>");
				//avec le "phoneto" http://www.nicolasaguenot.com/nicoandco/index.php?post/2011/06/16/Quel-est-le-code-html-pour-appeler-un-num%C3%A9ro-de-t%C3%A9l%C3%A9phone

				var web = $("<div></div>").addClass("item-web").text("Website : " + details.website);

				var toMap = $("<a></a>").addClass("toMap").attr("href", "#pagethree").text("Carte").data({	"transition": "slide",
																											"direction": "reverse"
																									});
				var toDetails = $("<a></a>").addClass("toDetails").attr("href", "#pagefour").text("Details").data("transition", "slide");

				item.append(tel);
				item.append(web);
				item.append(toMap);
				item.append(toDetails);

				toDetails.click(function() {

					var detailsPage = $("#details-content").html("");

					detailsPage.append(item);

					var content = $("<div></div>").addClass("content");

					var ouvert;
					if(details.opening_hours.open_now) {
						ouvert = "<b>Ouvert</b>";
					} else {
						ouvert = "<i>Fermé</i>";
					}
					content.append($("<div></div>").html("Ouvert aujourd'hui : "+ouvert));
					content.append($("<div></div>").html("<div>Horaires d'ouverture :</div>"+details.opening_hours.weekday_text));

					var reviews = $("<div></div>").addClass("reviews");
					for(var i=0;i<details.reviews.length;i++) {
						var rev = $("<div></div>").addClass("rev-item").html("<hr><b>"+details.reviews[i].author_name + "</b><br><i style='color:#ffdf39' class='fas fa-star'></i>" + details.reviews[i].rating + "<br>"+details.reviews[i].text+"<br>");
						reviews.append(rev);
					}
					content.append(reviews);

					detailsPage.append(content);

				});
			},
			error: function(error){
				console.log('details error');
			}
		});
	}
});
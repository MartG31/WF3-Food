"use strict";

// https://maps.googleapis.com/maps/api/place/textsearch/json?query=restaurant+toulouse&

// WF3-food key=AIzaSyAUqogljBCOIKf9KKI98L4mPJUdaF-_V3k
// histo-carto1 key=AIzaSyCEKxl41ov7xsReO1fCJOWokqXMBGGRgUk
// histo-carto2 key=AIzaSyDpIrYXtVYZFRFY0SVdY1MyKgZO96iN9nM
// axel1 key=AIzaSyBzwf88gItmvWmzXU8rNYs9mP-PbGwdg7E
// axel2 key=AIzaSyBq1U1sm0HowdX6ndei9MZabaMBi7qNZqU





$(document).ready(function(){

	// BARRE DE RECHERCHE

	$('#search').change(function(e) {

		e.preventDefault();

		var query = $(this).val();
		console.log('Nouvelle requête à envoyer : '+query);

		if(query.length > 0) {

			searchQuery(query);
		}
	});



	// PLACE OBJECTS

	var placesTab = new Array();


	// On construit une "classe" Place, à partir de laquelle on pourra
	// créer autant d'objets que l'on veut, chaque Place pouvant contenir
	// les infos, les details, les photos... malgré le fait que toutes les
	// données ne seront pas chargées au même moment.
	function Place(search) { 
		this.search = search;
		this.vignette;

		this.details;
		this.page;

		this.photos = new Array();


		// METHODES

		this.buildListItem = function() {

			// CREATE LIST ITEM
			var listItem = $("<div></div>").addClass("list-item").attr("data-id", this.search.id);


			// CREATE CONTENT
				var head = $("<div></div>").addClass("item-head");

					var fig = $("<figure></figure>").addClass("item-fig");
						var img = $("<img>").addClass("item-img");
					fig.append(img);

				head.append(fig);

					var core = $("<div></div>").addClass("item-core");

						var info = $("<div></div>").addClass("item-info");

							var name = $("<div></div>").addClass("item-name").text(this.search.name);
							var adr = $("<div></div>").addClass("item-adr").text(this.search.formatted_address);
							
							var open = $("<div></div>");
								if(this.search.opening_hours.open_now) { 
									open.addClass("item-open").text("Ouvert"); 
								}
								else if(this.search.opening_hours.open_now == false) { 
									open.addClass("item-closed").text("Fermé"); 
								}

						info.append(name);
						info.append(adr);
						info.append(open);

						var links = $("<div></div>").addClass("item-links");

							var toMap = $("<a></a>")
								.addClass("item-link")
								.addClass("to-map")
								.text("Map")
								.attr("href", "#mapview")
								.attr("data-transition", "slide")
								.attr("data-direction", "reverse");
							var toDet = $("<a></a>")
								.addClass("item-link")
								.addClass("to-det")
								.text("Détails")
								.attr("href", "#details")
								.attr("data-transition", "slide");

						links.append(toMap);
						links.append(toDet);

					core.append(info);
					core.append(links);

				head.append(core);


			listItem.append(head);

			// On stocke l'élément HTML dans la "vignette" de l'objet Place
			// pour pouvoir y accéder facilement par la suite, et on l'ajoute
			// aussi à la liste pour l'afficher.
			this.vignette = listItem;
			$("#results-content").append(listItem);
		};

		this.buildDetails = function() {

			var page = $("<div></div>").addClass("det-page");

				var name = $("<div></div>").addClass("det-name").text(this.details.name);
				page.append(name);

				var tel = $("<a></a>").addClass("det-tel")
					.attr("href","tel:"+this.details.international_phone_number)
					.text(this.details.formatted_phone_number);

				page.append(tel);

				if(this.details.website) {

					var web = $("<a></a>").addClass("det-web")
						.attr("href",this.details.website)
						.text(this.details.website);
					page.append(web);
				}


				page.append($("<div></div>").html("<div>Horaires d'ouverture :</div>"+this.details.opening_hours.weekday_text));

				var reviews = $("<div></div>").addClass("reviews");
				for(var i=0;i<this.details.reviews.length;i++) {
					var rev = $("<div></div>").addClass("rev-item").html("<hr><b>"+this.details.reviews[i].author_name + "</b><br><i style='color:#ffdf39' class='fas fa-star'></i>" + this.details.reviews[i].rating + "<br>"+this.details.reviews[i].text+"<br>");
					reviews.append(rev);
				}
				page.append(reviews);

			this.page = page;
		};
	}

	// GOOGLE PLACES API QUERIES

	const axKey = 'AIzaSyBq1U1sm0HowdX6ndei9MZabaMBi7qNZqU';
	const axUrl = 'https://axessweb.io/api/google';

	const mgKey = 'AIzaSyDXSo16GjucBJLgaWtidWjZVsPjLq2f4iE';

	searchQuery("restaurant toulouse");

 
	function searchQuery(req) {

		var dataParams = {
			url: 'https://maps.googleapis.com/maps/api/place/textsearch/json', // URL de l'API Google
			key: mgKey, // Nouvelle clé d'api
			query: req // Requete
		}

		$.ajax({
			url: axUrl, // URL de mon serveur pour outrepasser les restrictions Google, ne pas modifier.
			type: 'GET',
			data: dataParams, 
			success: function(json){
				console.log("search success ("+json.results.length+")");
				console.log(json);

				// on vide la liste et on supprime et les places
				var answers = $("#answers");
				answers.html("");
				placesTab = [];

				// On crée les nouvelles places
				for (var i=0; i<json.results.length; i++) {

					var newPlace = new Place(json.results[i]);
					newPlace.buildListItem();
					placesTab.push(newPlace);

					detailsQuery(newPlace);
					photoQuery(newPlace, true);
				}
			},
			error: function(error){
				console.log('search error');
			}
		});
	}
	
	function detailsQuery(place) {

		var dataParams = {
			url: 'https://maps.googleapis.com/maps/api/place/details/json',
			key: mgKey,
			placeid: place.search.place_id
		}

		$.ajax({
			url: axUrl,
			type: 'GET',
			data: dataParams, 
			success: function(rep){
				console.log("details success");
				console.log(rep);

				place.details = rep.result;
				place.buildDetails();

				place.vignette.find(".to-det").click(function() {
					$("#details-content").html(place.page);
				});
			},
			error: function(error){
				console.log('details error');
			}
		});
	}

	function photoQuery(place, mainPhoto) {

		if(mainPhoto) {
			var src = 'https://maps.googleapis.com/maps/api/place/photo'+
			'?maxwidth=1600'+
			'&photoreference='+
			place.search.photos[0].photo_reference+
			'&key='+
			mgKey;

			place.vignette.find(".item-img").attr("src",src);
		} else {
			place.photos.push();
		}
	}

});

$(document).ready(function() {

	console.log(json);
	console.log(json.results);
	console.log(json.results.length);

	for (var i=0; i<json.results.length; i++) {
		var currentRes = json.results[i];

		console.log('----------');
		console.log(currentRes.name);
		console.log(currentRes.formatted_address);

	}



});




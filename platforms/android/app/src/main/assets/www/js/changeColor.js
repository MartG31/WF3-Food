$(document).ready(function() {
	$('.changeColor').click(function(){
		var color = $(this).css("background-color");
		$('#home').css('background-color', color);
		$('#results').css('background-color', color);
		$('#mapview').css('background-color', color);
		$('#details').css('background-color', color);
	});
});
$(document).ready(function() {
	$('.changeColor').click(function(){
		var color = $(this).css("background-color");
		$('#pageone').css('background-color', color);
		$('#pagetwo').css('background-color', color);
		$('#pagethree').css('background-color', color);
		$('#pagefour').css('background-color', color);
	});
});
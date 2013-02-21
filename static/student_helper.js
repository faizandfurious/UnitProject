$('.class_item').click(function(){
	var color = $(this).css('background-color');
	console.log(color);
	$(this).css('background-color', 'blue');
	setTimeout(function(){
		$('#class_panel').css('display', 'block');
		$("#intro_panel").css('display', 'none');
	}, 1000);
});

$('.back_button').click(function(){
	$('.class_item').css('background-color', '#d6d1d1');
	$('#class_panel').css('display', 'none');
	$("#intro_panel").css('display', 'block');

})
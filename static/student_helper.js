$('.class_item').click(function(){
	$('#class_panel').css('display', 'block');
	$("#intro_panel").css('display', 'none');
});

$('.back_button').click(function(){
	$('#class_panel').css('display', 'none');
	$("#intro_panel").css('display', 'block');

})
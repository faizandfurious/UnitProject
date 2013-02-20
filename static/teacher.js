$('.quiz_box').click(function(){
	var ele = $('.quiz_box');
	var par = ele.parent();
	par.hide();
	$('#quiz_display').css('visibility', 'visible');
});

$('#back_button').click(function(){
	$('#quiz_display').css('visibility', 'hidden');
	$('#quiz_listing').show();

})
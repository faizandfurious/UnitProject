var counter; //Used to control the countdown for the clock
var count = 10;

$(document).ready(function() {
	checkCookie();
	initializeScreen();
});

//This function hides the clock, normal quiz and quick quiz, as they do not need to be seen when the screen
//is first loaded. They will be shown when the server tells us to show them
function initializeScreen(){
	$('#clock').css('display', 'none');
	$('#normal_quiz').css('display', 'none');
	$('#quick_quiz').css('display', 'none');
}

//This is just a UX function that gives feedback on what was clicked. It should be transformed to know which
//class was clicked, and send the ID of that clicked element to the server, which would return the appropriate
//data model. It should also load the appropriate course tab.
$('.class_item').click(function(){
	var color = $(this).css('background-color');
	$(this).css('background-color', 'blue');
	setTimeout(function(){
		$('#class_panel').css('display', 'block');
		$("#course_selection").css('display', 'none');
	}, 50);
});

//This is the listener for the back button. It hides the course tab, and shows the initial intro panel
$('.back_button').click(function(){
	$('.class_item').css('background-color', '#d6d1d1');
	$('#class_panel').css('display', 'none');
	$("#course_selection").css('display', 'block');

});

//This is a debugging listener. When clicked, it will hide the default message, display the clock and show 
//the quick quiz form for a set amount of time
$('#start_quick_quiz').click(function(){
	$('.default_message').css('display', 'none');
	$('#clock').fadeIn();
	$('#quick_quiz').fadeIn();

	counter = setInterval(quick_quiz_timer, 1000);
});

//This is a debugging listener. When clicked, it will hide the default message, display the clock and show 
//the normal quiz form for a set amount of time
$('#start_normal_quiz').click(function(){
	$('.default_message').css('display', 'none');
	$('#clock').fadeIn();
	$('#normal_quiz').fadeIn();

	counter = setInterval(normal_quiz_timer, 1000);

});

//This is a timer that is used to administer the quick quiz. When the timer reaches zero, it calls the showInitialScreen() function
//which will need to be replaced. The replacement function should take the data from the form and send it to the server to be 
//aggregated and shown to the teacher. Not sure if there will be feedback for the student.
function quick_quiz_timer(){
	count = count-1;
	$('#clock').html(count);
	if (count <= 0){
		count = 10;
		clearInterval(counter);
		readData('#quick_quiz_form');
		showInitialScreen();
		$('#clock').html(count);
		return;
	}
}

//This is a timer that is used to administer the normal quiz. When the timer reaches zero, it calls the showInitialScreen() function
//which will need to be replaced. The replacement function should take the data from the form and send it to the server to be 
//aggregated and shown to the teacher. It should also reload the questions, but this time show the users choice, the correct answer,
//and a reason why the correct answer is correct.
function normal_quiz_timer(){
	count = count-1;
	$('#clock').html(count);
	if (count <= 0){
		count = 10;
		clearInterval(counter);
		readData('#normal_quiz_form');
		showInitialScreen();
		$('#clock').html(count);
	}
}

//This function gets the input from the form in an array format. The key is the name of the input (this should be set to the question id),
//and the value is the choice the user made (for the HTML markup, this is the value attribute for the input tag, and should be set to the
//answer id.).

function readData(form_name) {
	$(form_name).find(':checkbox:not(:checked)').attr('value', false);
	var data = $(form_name).serializeArray();
	console.log(data);
	sendAnswers(data);
}
//This is a temporary function that just reloads the default message
function showInitialScreen(){
	$('#clock').css('display', 'none');
	$('#normal_quiz').css('display', 'none');
	$('#quick_quiz').css('display', 'none');
	$('.default_message').fadeIn();
}
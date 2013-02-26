var quizzes = {} //array of quiz objects

$('.quiz_box').click(function(){
	var ele = $('.quiz_box');
	var par = ele.parent();
	par.hide();
	$('#quiz_display').css('visibility', 'visible');
});

$('#back_button').click(function(){
	$('#quiz_display').css('visibility', 'hidden');
	$('#quiz_listing').show();

});

$(".question_container").click(function(){
    
});

//This is a tester function that will reduce the size of the quiz_display div and make room for the current quiz
//selection panel
$('#create_quiz').click(function(){
    // var str_width = $('#content').css('width');
    // var width = str_width.replace( /[^0-9.]+/g, '');
    // console.log(width);
    // var i = width;

    // var interval = setInterval(function(){
    //     $('#content').css('width', i);
    //     i-=10;
    //     if(i < width-300){
    //         clearInterval(interval);
    //         showQuizPanel();
    //     }
    // }, 20);
    startQuiz([0, 1]);

});

//This function should be called when the teacher first starts to create a quiz
function showQuizPanel(){
    $('#quiz_panel').fadeIn().css("display","inline-block");
}

function sortQuizzes(questions){
    for(var key in questions){
        var q = questions[key];
        var topic = q.topic
        if (quizzes[topic] === undefined){
            quizzes[topic] = [q]
        }
        else{
            quizzes[topic].append(q)
        }
    }
}

function ClassPerformance(responses){
    
}

function getQuestions (){
    $.ajax({
        type: "get",
        url: "/questions",
        success: function(data){
            
        }
    })
}

function addQuestion(question, choices, answer){
    $.ajax({
        type: "post",
        data: {question : question, choices : choices, answer :answer},
        url: "/newquestion",
        success: function(data){
        }
    })
}

function startQuiz(quiz){
    console.log(quiz);
    $.ajax({
        type: "post",
        data: {questionIds: quiz},
        url: "/askquestions",
        success: function(data){}
    })
}

function studentResults(questionID){
    $.ajax({
        type: "get",
        url:"/question/"+questionID+"/results",
        success: function(data){
            ClassPerformance(data);
        }
    })
}

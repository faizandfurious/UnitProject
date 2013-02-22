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
        url: "/question/create",
        data: {"question" : question, "choices" : choices, "answer" :answer},
        success: function(data){
        }
    })
}

function startQuestion(questionID){
    $.ajax({
        type: "post",
        data: {"questionID": questionID},
        url: "/question/"+questionID,
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
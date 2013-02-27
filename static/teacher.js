var quizzes = {}; //array of quiz objects
var timer = 10; 
var currentQuiz;


function search(id){
    for(var key in quizzes){
        var quiz = quizzes[key];
        for(var ele in quiz){
            var quest = quiz[ele];
            if (id ===quest.id){
                return quest;
            }
        }
    }
    return false
}

$('.question').click(function(){
    var ob = this.attr('id');
    var question = search(ob);
    drawResults(students, question.id, question.choices)
});



function addClickListener(){
    $('.quiz_box').click(function(){
    	var ele = $('.quiz_box');
    	var par = ele.parent();
        console.log($(this).attr('id'));
        displayQuiz($(this).attr('id'));
    	par.hide();
    	$('#quiz_display').css('visibility', 'visible');
        $('#topic_buttons').css('visibility', 'visible');
    });
}

$('#back_button').click(function(){
	$('#quiz_display').css('visibility', 'hidden');
    $('#topic_buttons').css('visibility', 'hidden');
	$('#quiz_listing').show();

});

$(".question_container").click(function(){
    
});

//This is a tester function that will reduce the size of the quiz_display div and make room for the current quiz
//selection panel
$('#create_quiz').click(function(){
    console.log("starting");
    startQuiz(currentQuiz);
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
            console.log("The topic is " + topic + ", and it contains " + q);
            console.log(q);
        }
        else{
            console.log("The topic is " + topic + ", and it contains " + q);
            console.log(q);
            quizzes[topic].push(q)
        }
    }
}

function displayQuizzes(){
    var box = $("#quiz_listing");
    for (var key in quizzes){
        var newQuiz = $("<span>");
        newQuiz.addClass("quiz_box");
        newQuiz.attr('id', key);
        newQuiz.html(key);
        box.append(newQuiz);
    }
    addClickListener();
}

function displayQuiz(key){
    currentQuiz = [];
    var quiz = quizzes[key];
    var listing = $("<ul id='topic_question_list'>");
    for(var i =0; i<quiz.length;i++){
        var obj = quiz[i]
        var quest = $("<li>");
        quest.addClass("question");
        quest.attr('id', obj.id)
        var text = $("<div>");
        text.addClass("question_text");
        text.html(obj.text);
        quest.append(text);
        var answs = $("<ul class='answers'>");

        currentQuiz.push(obj.id/1);
        
        for(var j = 0; j<obj.choices.length; j++){
            var thing = $("<li>");
            thing.attr('id', ""+obj.id+"_"+j)
            thing.html(obj.choices[j])
            answs.append(thing);
        }
        quest.append(answs);
        listing.append(quest);
    }
    $('#quiz_display').html("");
    $('#quiz_display').append(listing);
}

function ClassPerformance(responses){
    
}

function getQuestions (){
    $.ajax({
        type: "get",
        url: "/questions",
        success: function(data){
            sortQuizzes(data.questions);
            displayQuizzes();
            
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
    console.log("The question ids in the quiz are: ");
    console.log(quiz);
    $.ajax({
        type: "post",
        data: {questionIds: quiz, time: timer},
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

var canvas = document.getElementById('graph');
var ctx = canvas.getContext("2d");

function max(list){
    var largest = 0;
    for(var i = 0; i<list.length; i++){
        if(list[i]> largest){
            largest = list[i]
        }
    }
    return largest;
}

function drawShell(){
    ctx.fillStyle = "black";
    ctx.fillRect(50, 20, 2, 300);
    ctx.fillRect(50, 320, 400, 2);
    ctx.fillRect(45, 69, 12, 2);
    ctx.fillRect(45, 119, 12, 2);
    ctx.fillRect(45, 169, 12, 2);
    ctx.fillRect(45, 219, 12, 2);
    ctx.fillRect(45, 269, 12, 2);
}

function drawScale(scale, labels, dist){
    ctx.font = "10px Arial";
    ctx.textAlign = "center";
    ctx.fillStyle = "black";
    ctx.fillText(""+(scale*5), 35, 74);
    ctx.fillText(""+(scale*4), 35, 124);
    ctx.fillText(""+(scale*3), 35, 174);
    ctx.fillText(""+(scale*2), 35, 224);
    ctx.fillText(""+(scale), 35, 274);
    for(var j = 0; j<labels.length; j++){
        ctx.fillText(labels[j], 50+dist+ (dist*j), 330)
    }

}

function drawBars(units, dis, choices){
    var colors = ["red", "blue", "yellow", "purple", "orange", "green"];
    for (var i= 0; i<choices.length;i++){
        var height = 250*(choices[i]/(units*5));
        var width = 30;
        var col = i%(colors.length);
        ctx.fillStyle = colors[col];
        ctx.fillRect((50+dis+dis*i-15),(320-height), width, height)
    }
}

//give this function the students object, the questionID for the click, and then
//choices array for that questionS
function drawResults(students, questionID, questionChoices){
    drawShell();
    var stuff = []
    var total = 0
    for (var i= 0; i<questionChoices.length; i++){
        stuff.push(0);
    }
    for(var key in students){
        var studAns = students[key].responses[questionID];
        total++;
        for(var i = 0; i<questionChoices.length; i++){
            if ( studAns === i){
                stuff[i]+=1;
            }
        }
    }
    var canvas = document.getElementById('graph')
    var ctx = canvas.getContext("2d")
    drawShell(canvas, ctx)
    console.log(total);
    var cap = max(stuff);
    var units = 0;
    if (cap%5 ===0){
        units = cap/5;
    }
    else{
        units = Math.floor((cap+5)/5)
    }
    var spread = (400/(questionChoices.length +1));
    drawScale(units, questionChoices, spread);
    drawBars(units, spread, stuff);

}

$(document).ready(function() {
    getQuestions();
})

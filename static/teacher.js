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
    startQuiz([0]);

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
//choices array for that question
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

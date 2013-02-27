var quizzes = {} //array of quiz objects
var currentQuiz;
var students = [];

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
        }
        else{
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
            thing.attr('id', ""+obj.id+"_"+j);
            thing.html(obj.choices[j]);
            answs.append(thing);
        }
        quest.append(answs);
        listing.append(quest);
    }
    $('#quiz_display').html("");
    $('#quiz_display').append(listing);
}



function displayResults(topic){ //give a topic to see results for
    var quiz = quizzes[topic];
    var listing = $("<ul id='quiz_results_list'>");
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
        for(var j = 0; j<obj.choices.length; j++){
            var thing = $("<li>");
            thing.attr('id', ""+obj.id+"_"+j);
            thing.html(obj.studs[j]+"  "+obj.choices[j]); //displays the number of students who chose that answer to the left of the question
            answs.append(thing);
        }
        quest.append(answs);
        listing.append(quest);
    }
    //DOM element to show the student result bell curve depending on desired scale 
    var bell1 = $("<input type ='checkbox' name= 'bellcurve' value = 'grades'>"); //should call bellcurve wit the current quizzes topic and scaleIndex of 0
    var bell2 = $("<input type ='checkbox' name= 'bellcurve' value = '10s'>")//should call bellcurve wit the current quizzes topic and scaleIndex of 1
    var bell3 = $("<input type ='checkbox' name= 'bellcurve' value = '5s'>")//should call bellcurve wit the current quizzes topic and scaleIndex of 2
    listing.append(bell1);
    listing.append(bell2);
    listing.append(bell3);
    $('#quiz_display').html("");
    $('#quiz_display').append(listing);
}

function editQuestion(question){
    var wrap = $("<div>");
    var quest = $("<input>");
    quest.attr('type', 'text');
    quest.attr('name', 'question');
    quest.attr('value', question.text);
    var options = question.choices;
    wrap.append(quest);
    for(var i = 0; i<options.length; i++){
        var section = $("<div>");
        var ans = $("<input>");
        ans.attr('type', 'radio');
        ans.attr('name', 'answer');
        var choice = $("<input>");
        choice.attr('type', 'text');
        choice.attr('name', 'choice'+i);
        choice.attr('value', options[i]);
        if( i === question.answer){
            ans.attr('checked');
        }
        section.append(ans);
        section.append(choice);
        wrap.append(section);
    }
    //add choice button at bottom
    //add this to the DOM somewhere
}

function addChoice(){
    
}
function ClassPerformance(responses){
    var quiztype =currentQuiz[0].topic;
    for(var i =0; i<students.length; i++){
        var taker = students[i];
        var count  = 0;
        var quiztotal = 0;
        currentQuiz.forEach(function(x){
            x.studs = []; //starts a question array for saving the student choices per choice
            quiztotal+=1;
            var possibles = x.choices
            for(var j = 0; j<possibles.length; j++){ //makes the array same length as choices
                x.studs.push([0]);
            } 
            var choice = taker.responses[x.id] //selects the students choice
            for (var k = 0; k<possibles.length; k++){
                if(choice === k){
                    x.studs[k]+=1; //adds to the result index to otal al lthe students choices per question
                }
            }
            if (choice === x.answer){
                count +=1;
            }
        })
        taker[quiztype] = Math.round(count/quiztotal) //creates a student object method at the quiz topic for the students grade on that quiz
    }
    displayResults();
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
    console.log(quiz);
    $.ajax({
        type: "post",
        data: {questionIds: quiz},
        url: "/askquestions",
        success: function(data){}
    })
}


function studentResults(){
    $.ajax({
        type: "get",
        url:"/studentResults",
        success: function(data){
            students = data.students;
            ClassPerformance();
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

function getData(topic){
    var grades = [];
    for(var i = 0; i<students.length; i++){ //gets all the student grades
        var stud =  students[i];
        var grade = stud[topic];
        grades.push(grade);  
    }
    return grades;
}
var scales = [["0-59", "60-69", "70-79", "80-89", "90-100"], ['0-9', '10-19', '20-29', '30-39', '40-49', '50-59', '60-69', '70-79', '80-89', '90-100'], ['0-4', '5-9', '10-14', '15-19', '20-24', '25-29', '30-34', '35-39', '40-44', '45-49', '50-54', '55-59', '60-64', '65-69', '70-74', '75-79', '80-84', '85-89', '90-94', '95-100']]

function getBars(ind, measure, data, bars){
    for (var i = 0; i<data.length;i++){
        var grade =data[i]
        if (ind === 0){
            if(grade<60){
                bars[0]+=1
            }
            else if(grade<70){
                bars[1]+=1;
            }
            else if(grade<80){
                bars[2]+=1;
            }
            else if(grade<90){
                bars[3]+=1;
            }
            else if(grade<101){
                bars[4]+=1;
            }
        }
        else{
            if (grade === 100){
                loc = data.length-1;
            }
            else{
                var loc = Math.floor(grade/measure);
            }
            bars[loc]+=1;
        }
    }
}
    
function drawGraph(data, scale){
    var size = max(data)
    var units = 0;
    if (size%5 ===0){
        units = size/5;
    }
    else{
        units = Math.floor((size+5)/5);
    }
    var dist = 400/(scale.length+1);
    drawScale(units, scale, dist);
    for( var i = 0; i<data.length;i++){
        var height = 250*(data[i]/(units*5));
        var width = dist;
        ctx.fillStyle = 'red';
        ctx.fillRect((50+dist+dist*i-(dist/2)),(320-height), width, height);       
    }
}
//need to add checkboxxes to select scale
function bellCurve(topic, scaleIndex){
    var data = getData(topic);
    drawShell();
    var bars = [];
    var scale = scales[scaleIndex];
    for (var j =0; j<scale.length; j++){
        bars.push(0);
    }
    var unit = 100/scale.length;
    var graphdata = getBars(scaleIndex, unit, data, bars);
    drawGraph(graphdata, scale);
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
    students.forEach(function(x){
        var studAns = x.responses[questionID];
        total++;
        for(var i = 0; i<questionChoices.length; i++){
            if ( studAns === i){
                stuff[i]+=1;
            }
        }
    })
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
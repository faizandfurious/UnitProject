var quizzes = {} //array of quiz objects
var currentQuiz;
var students = [];
var adding = false;
var graph_shown = false;

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
    return false;
}

$('.question').click(function(){
    var ob = this.attr('id');
    var question = search(ob);
    drawResults(students, question.id, question.choices)
});

$('#add_a_question').click(function(){
    if(!adding){
        $("#create_question_form").html("");
        adding = true;
        addQuest();
    };
});

$('#get_results').click(function(){
    studentResults(currentQuiz);
    if(graph_shown){
        $('#get_results').html("View Results");
        $('#graph_holder').slideUp();
        graph_shown = false;
    }
    else{
        $('#get_results').html("Hide Results");
        $('#graph_holder').slideDown();
        graph_shown = true;
    }
});

function addClickListener(){
    $('.quiz_box').click(function(){
    	var ele = $('.quiz_box');
    	var par = ele.parent();
        
        var top = $(this).attr('id');
        var check =quizzes[top]
        if (check[0].studs === undefined){
            displayQuiz(top);
        }
        else{
            displayResults(top);
        }
    	par.hide();
    	$('#quiz_display').css('visibility', 'visible');
        $('#topic_buttons').css('visibility', 'visible');
    });
}

$('#back_button').click(function(){
	$('#quiz_display').css('visibility', 'hidden');
    $('#topic_buttons').css('visibility', 'hidden');
    $("#page_title").html("Topics");
	$('#quiz_listing').show();

});

//This is a tester function that will reduce the size of the quiz_display div and make room for the current quiz
//selection panel
$('#create_quiz').click(function(){
    startQuiz(currentQuiz);
});

//This function should be called when the teacher first starts to create a quiz
function showQuizPanel(){
    $('#quiz_panel').fadeIn().css("display","inline-block");
}

function sortQuizzes(questions){
    quizzes = {};
    for(var key in questions){

        var q = questions[key];
        var topic = q.topic
        if (quizzes[topic] === undefined){
            quizzes[topic] = [q]
        }
        else{
            quizzes[topic].push(q);
        }
    }
}

function displayQuizzes(){
    var box = $("#quiz_listing");
    box.html("");
    $("#page_title").html("Topics");
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
    $("#page_title").html(key);
    var quiz = quizzes[key];
    var listing = $("<ul id='topic_question_list'>");
    for(var i =0; i<quiz.length;i++){
        var obj = quiz[i]
        var quest = $("<li>");
        quest.addClass("question");
        quest.attr('id', obj.id);
        var text = $("<div>");
        text.addClass("question_text");
        text.html(obj.text);
        quest.append(text);
        var answs = $("<ul class='answers'>");

        $('.edit_question').click(function(){
            var ob = this.attr('id');
            var question = search(ob);
            editQuestion(question);
        });

        currentQuiz.push(obj.id/1);
        
        for(var j = 0; j<obj.choices.length; j++){
            var thing = $("<li>");
            thing.attr('id', ""+obj.id+"_"+j);
            thing.html(obj.choices[j]);
            if(obj.answer/1 === j){
                thing.prepend("<span class='answer_indicator' id='answer_correct'></span>");
            }
            else{
                thing.prepend("<span class='answer_indicator'></span>");
            }

            answs.append(thing);
        }
        quest.append(answs);
        listing.append(quest);
    }
    $('#quiz_display').html("");
    $('#quiz_display').append(listing);
}


//displays quiz results
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
    var bell1 = $("<input type ='checkbox' class = 'bell' id = 'bell_grade' name= 'bellcurve' value = 'grades'/>"); //should call bellcurve wit the current quizzes topic and scaleIndex of 0
    var bell2 = $("<input type ='checkbox' class = 'bell' id = 'bell_10' name= 'bellcurve' value = '10s'/>")//should call bellcurve wit the current quizzes topic and scaleIndex of 1
    var bell3 = $("<input type ='checkbox' class = 'bell' id = 'bell_5' name= 'bellcurve' value = '5s'/>")//should call bellcurve wit the current quizzes topic and scaleIndex of 2
    listing.append(bell1);
    listing.append(bell2);
    listing.append(bell3);
    $('.bell').click(function(){ //listens for selection of bellcurve
        var type= $(this).attr('id');
        if( type === 'bell_grade'){
            bellCurve(topic, 0);
        }
        else if (type === 'bell_10'){
            bellCurve(topic, 1);
        }
        else{
            bellCurve(topic, 2);
        }
    })
    $('#quiz_display').html("");
    $('#quiz_display').append(listing);
}

function addQuest(){
    var temp = { text: '', choices : ['', ''], answer: 0, topic: ''}
    editQuestion(temp);
}

//give it the question to be edited 
function editQuestion(question){
    var wrap = $("#create_question_form");
    var quest = $("<input type='text' name='question' placeholder='Question...?' class='text_box' value= " + question.text + "></input>");
    var q_topic = $("<input type='text' name='topic' placeholder='Topic' class='text_box' value= " + question.topic + "></input>");

    var options = question.choices;
    wrap.append(quest);
    wrap.append(q_topic);
    wrap.append("<br>");
//need to add topic selection area
    var counter = 0;
    for(var i = 0; i<options.length; i++){
        counter = i;
        var label = $("<span>");
        var ans = "<input type='radio' name='ans' id='answer"+i+"'></input>";
        var choice = "<input type='text' placeholder='Possible Answer...' name='choice' class='text_box'></input>";

        //This checks to see if the current option (to be edited) was the answer. If so, set it as the answer.
        if( i === question.answer){
        }

        label.append(ans + choice);
        wrap.append(label);
        wrap.append("<br>");
    }
    //Used for extra 
    wrap.append("<div id='extras'>");

    //Buttons
    var addChoice = $("<input type= 'button' value = 'Add Another Answer' id = 'add_a_choice' class='btn'></input>")
    wrap.append(addChoice);
    wrap.append("</br>");
    var back = $("<input type='button' value ='Close' id = 'cancel_question' class='btn'></input>")
    wrap.append(back);
    var submit = $("<input type='button' value ='Submit' id = 'submit_question' class='btn'></input>")
    wrap.append(submit);

    $("#cancel_question").click(function(){
        adding = false;
        $("#create_question_form").slideUp();
    });

    $('#quick_comp').append(wrap.get(0));
    $("#create_question_form").slideDown();

    $('#add_a_choice').click(function(){
        var label = $("<span>");
        var ans = "<input type='radio' name='ans' id='answer"+ counter +"  checked'></input>";
        var choice = "<input type='text' placeholder='Possible Answer...' name='choice' class='text_box'></input>";
        $('#extras').append(ans + choice);
        $('#extras').append("</br>");
        wrap.append(label);
    });

    $('#submit_question').click(function(){
        adding = false;
        $("#create_question_form").slideUp();
        var data = wrap.serializeArray();
        var question = "";
        var choices = [];
        var answer = 0;
        var topic = "";
        for(item in data){
            if(data[item].name === "question"){
                question = data[item].value;
            }
            else if(data[item].name === "topic"){
                topic = data[item].value;
            }
            else if(data[item].name === "choice"){
                choices.push(data[item].value);
            }
            else{
                answer = data[item].name/1;
            }
        }

        addQuestion(question, choices, answer, topic);

        getQuestions();

        // $.ajax({
        //     type: "post",
        //     data: {questionIds: quiz},
        //     url: "/editquestion/",
        //     success: function(data){}
        // })
    });
}

function addChoice(question){
    question.choices.push("");
    editQuestion(question); //calls editQuestion again to refresh the edit QUestion DOM section
}

function submitQuestion(question){
    var qu = $("input[name=question]"); //select the input for question
    if(qu.value === ""){
        alert("you do not have a question to submit!");
        return;
    }
    var text= qu.value;
    var answer = -1;
    var choices = [];
    var remove = 0;
    for(var i= 0; i<question.choices.length;i++){
        var choice = $("input[name=choice"+i+"]");
        var ans = $("#answer"+i);
        if (choice.attr('value') ===""){
            remove+=1;
        }
        else{
            var change = (i-remove);
            if(ans.attr("checked") ==='checked'){
                answer= change;
            }
            choices=choice.value;
        }
    }
    if (answer === -1){
        alert("you do not have an answer selected")
        return;
    }
    if (question.id === undefined){
        addQuestion(text, choices, answer, topic);
    }
    else{
        editedQuestion(text, choices, answer)
    }
}

function ClassPerformance(responses, quiz){
    var quiztype = quiz[0].topic;
    for(var i =0; i<students.length; i++){
        var taker = students[i];
        var count  = 0;
        var quiztotal = 0;
        quiz.forEach(function(x){
            quizzes.x.studs = []; //starts a question array for saving the student choices per choice
            quiztotal+=1;
            var possibles = x.choices;
            for(var j = 0; j < possibles.length; j++){ //makes the array same length as choices
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
    saveData(students, currentQuiz);
    displayResults();
}

function saveData(students, questionsList){
    $.ajax({
        type: "post",
        url: "/saveAnalysis",
        data: {students : students, quiz : questionsList},
        success: function(data){
        }
    })
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

function editedQuestion(text, choices, answer, topic, id){
    $.ajax({
        type: 'post',
        data: {id: id, text: text, choices: choices, answer:answer, topic: topic},
        url: '/editquestion',
        success: function(data){
            
        }
    })
}

function addQuestion(question, choices, answer, topic){
    $.ajax({
        type: "post",
        data: {question : question, choices : choices, answer :answer, topic :topic},
        url: "/newquestion",
        success: function(data){
        }
    })
}

function startQuiz(quiz){
    $.ajax({
        type: "post",
        data: {questionIds: quiz, time : "30"},
        url: "/askquestions",
        success: function(data){}
    })
}


function studentResults(quiz){
    $.ajax({
        type: "get",
        url:"/studentResults",
        success: function(data){
            students = data.students;
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
    ctx.fillStyle = '#f9faf7';
    ctx.fillRect(0,0,500,400);
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
    return bars
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
    var check = false;
    if( scale.length>10){
        check = true;
    }
    drawScale(units, scale, dist, check);
    for( var i = 0; i<data.length;i++){
        var height = 250*(data[i]/(units*5));
        var width = dist;
        ctx.fillStyle = 'red';
        ctx.fillRect((50+dist+dist*i-(dist/2)),(320-height), width, height);
        ctx.fillStyle= 'black';
        ctx.strokeRect((50+dist+dist*i-(dist/2)),(320-height), width, height);
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

function drawScale(scale, labels, dist, toobig){
    ctx.font = "10px Arial";
    ctx.textAlign = "center";
    ctx.fillStyle = "black";
    ctx.fillText(""+(scale*5), 35, 74);
    ctx.fillText(""+(scale*4), 35, 124);
    ctx.fillText(""+(scale*3), 35, 174);
    ctx.fillText(""+(scale*2), 35, 224);
    ctx.fillText(""+(scale), 35, 274);
    var i =0;
    for(var j = 0; j<labels.length; j++){
        ctx.fillText(labels[j], 50+dist+(dist*j), 330+10*(i%2));
        if(toobig){
            i++;
        }
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
    var cap = max(stuff);
    var units = 0;
    if (cap%5 ===0){
        units = cap/5;
    }
    else{
        units = Math.floor((cap+5)/5)
    }
    var spread = (400/(questionChoices.length +1));
    drawScale(units, questionChoices, spread, false);
    drawBars(units, spread, stuff);

}

$(document).ready(function() {
    $("#create_question_form").css('display', 'none');
    $("#page_title").html("Topics").css('visibility', 'visible');
    drawShell();
    getQuestions();
})

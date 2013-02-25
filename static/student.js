var student = {};
var questions = {};//global data storage

function refreshDOM(){     


}

//selections is an array of the clicked choices in the order of the quiz questions
function quizChoices (selections){
    var results = []
    for(var i = 0; i<selections.length; i++){
        var currentQuestion = questions.curr[i]
        results.push([currentQuestion , selections[i]]);
    }
    student.curr = results
    sendAnswers(results);
}

function postResults(results){
    var AnswersList = $("<ul>");
    for(var i = 0; i<results.length; i++){
        var newLi = $("<li>");
        var words = $("<div>");
        var res = $("<div>");
        var gratify = $("<div>");
        var correct= results[i];
        var questionid = results[i][0];
        var studs = student.curr[i];
        res.html(questions[questionid].choices[studs[1]]);
        words.addClass("question");
        words.html(results[0].text);
        if (studs[1] === correct[1]){
            gratify.html("Correct!")
        }
        else{
            gratify.html(results[2])
        }
        newLi.append(words);
        newLi.append(res);
        newLi.append(gratify);
        AnswersList.append(newLi);
    }
}

function getStudentId(){
    $.ajax({
        type: "get",
        url: "/studentId",
        success: function(data){
            student.id = data.studentId; //saves the student id in array
            console.log("Student Id is "+ data.studentId);
            student.question = []; //starts an array for saving question responses
        }
    })
}

function questions(){
    $.ajax({
        type: "get",
        url: "/question",
        success: function(data){
            questions = data;
            questions.curr = [];
            refreshDOM();
        }
    })
}

function sendAnswers(answersarray){
    $.ajax({
        type: "post",
        url: "/studentAnswers/"+student.id,
        data: { studentAnswers : answersarray},
        success: function(data){
            postResults(data.rightAnswers)
            refreshDOM()
        }
    })
}
    

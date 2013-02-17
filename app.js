var express = require("express"); // imports express
var app = express();        // create a new instance of express

// This is for serving files in the static directory
app.get("/static/:staticFilename", function (request, response) {
    response.sendfile("static/" + request.params.staticFilename);
});


function initServer() {
    loadData();
}

function loadData() {
    loadQuestions();
    loadStudents();
}

//read file with questions data and populate questions data structure 
function loadQuestions() {

}

//read file with students data and populate students data structure 
function loadStudents() {

}

function answerQuestion() {
    //update question data
    //update student data
}

function showQuestion(questionId) {
    //for each student, get question by  questionId from questions data structure
    //and update student's question data to contain it
}


function showAnswer(questionId) {
    //for each student, get answer of questionId from questions data structure
    //and update student's question data with answer
}


// Finally, initialize the server, then activate the server at port 8889
initServer();
app.listen(8889);

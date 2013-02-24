var express = require("express"); // imports express
var app = express();        // create a new instance of express
var fs = require("fs");

app.use(express.bodyParser());

// This is for serving files in the static directory
app.get("/static/:staticFilename", function (request, response) {
    response.sendfile("static/" + request.params.staticFilename);
});

// This is for serving files in the static directory
app.get("/static/styles/:staticFilename", function (request, response) {
    response.sendfile("static/styles/" + request.params.staticFilename);
});

var questions;
var students;
var studentCounter;

function question() {
    var exports = {};

    exports.text = "";

    exports.choices = [];

    exports.answer = -1;

    exports.topic = "";

    exports.explanation = "";

    return exports;

}

function initServer() {
    loadData();
    studentCounter = 0;
}

function loadData() {
    loadQuestions();
    loadStudents();
}

// Asynchronously read file contents, then call callbackFn
function readFile(filename, defaultData, callbackFn) {
  fs.readFile(filename, function(err, data) {
    if (err) {
      console.log("Error reading file: ", filename);
      data = defaultData;
    } else {
      console.log("Success reading file: ", filename);
    }
    if (callbackFn) callbackFn(err, data);
  });
}

// Asynchronously write file contents, then call callbackFn
function writeFile(filename, data, callbackFn) {
  fs.writeFile(filename, data, function(err) {
    if (err) {
      console.log("Error writing file: ", filename);
    } else {
      console.log("Success writing file: ", filename);
    }
    if (callbackFn) callbackFn(err);
  });
}

//read file with questions data and populate questions data structure 
function loadQuestions() {
    var empty = "[]";
    readFile("questions.txt", empty, function(err, data) {
        questions = JSON.parse(data)
    });
}

//read file with students data and populate students data structure 
function loadStudents() {
    var empty = "[]";
    readFile("students.txt", empty, function(err, data) {
        students = JSON.parse(data)
    });
}

app.get("/studentId", function(request, response){
    //intial client/server interaction, requests teh student ID from the server
    studentCounter++;
    var name = request.params.name;

    students[studentCounter] = { "id" : studentCounter,
                                 "name" : name,
                                 "responses" : "[]" };

    response.send({
        studentId : studentCounter,
        success : true
    });
    
    writeFile("students.txt", JSON.stringify(students));

});

app.post("/question/:id", function(request, response){
    //given and object {"id": studentID, "answer" : studentAnswer} where studentAnswer is
    //index of the students choice in the choises string array.
    var questionId = request.params.id;
    var studentId = request.body.id;
    var answer = request.body.answer;

    students[studentId].response[questionId] = answer;

    writeFile("students.txt", JSON.stringify(students));

    response.send({
        correctAnswer: questions[questionId].answer,
        success: true
    });
    
});


app.get("/question/:id", function(request, response){
    //responds with question and choices of given id
    var id = request.params.id;
    
    if(id < questions.length) {
        response.send({
            question : questions[id].text,
            choices : question[id].choices,
            success : true
        });
    }

    else {
        response.send({
            success:false
        });
    }
});

app.post("/newquestion", function(request, response){
    q = new question();
    console.log(request.body);
    q.text = request.body.question;
    q.choices = request.body.choices;
    q.answer = request.body.answer;

    questions.push(q);

    response.send({
        questions: questions,
        success : true
    });
});

app.get("/questions", function (request, response) {
    response.send({
        questions : questions,
        success : true
    });
});

// Finally, initialize the server, then activate the server at port 8889
initServer();
app.listen(8889);

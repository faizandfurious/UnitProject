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

var questionQueue;
var questions;
var questionCounter;
var students;
var studentCounter;

function question() {
    var exports = {};

    exports.id = -1;

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

app.post("/studentId", function(request, response){
    //intial client/server interaction, requests teh student ID from the server
    var id = request.body.studentId;
    console.log(id);
    var found = false;
    for(var i in students){
        if(students[i] !== null && students[i].id === id){
            found = true;
            break;
        }
    }
    if(!found){
        students[++studentCounter] = {id : id,
                            "responses" : "[]" };

        writeFile("students.txt", JSON.stringify(students));
    }

    response.send({
        studentId : id,
        success : true
    });

});


//the id in the url is the student id
app.post("/studentAnswer/:id", function(request, response){
    
    var studentId = request.params.id;
    //studentAnswers is a 2d array of the question id and the student's response:
    //i.e. [ [qId_1, a_1] , [qId_2, a_2] . . . ]
    var studentAnswers = request.body.studentAnswers;
    //rightAnswers gets filled the same way in the forEach loop with the correct 
    //answers instead of the student answers along with the teacher explanation of the answer
    //as a third element
    var rightAnswers = [];

    studentAnswers.forEach(function(x) {
        var questionId = x.name;
        var studentAnswer = x.value;
        var rightAnswer = questions[questionId].answer;
        var explanation = questions[questionId].explanation;

        rightAnswers.push([questionId, rightAnswer, explanation]);
        students[studentId].responses[questionId] = studentAnswer;
    });
    
    writeFile("students.txt", JSON.stringify(students));

    response.send({
        rightAnswers : rightAnswers,
        success: true
    });
    
});

//teacher sends list of ids of questions on next quiz
//those questions are put in to question queue
app.post("/askquestions", function(request, response) {
    var questionIds = request.body.questionIds;
    questionQueue = [];
    console.log(questionIds);

    for(var id in questionIds){
        console.log(id);
        questionQueue.push({"id" : id,
                                "question" : questions[id].text,
                                "choices" : questions[id].choices});
    }
    response.send({
        success : true
    });
    
    setTimeout(function(){
        questionQueue = [];
    }, 11000);

});

//when student requests questions, they get the current queue 
//the teacher formed.
app.get("/getquestions", function(request, response) {
    if(questionQueue !== undefined && questionQueue.length > 0){
        response.send({
            quiz : questionQueue,
            success : true
        });
    }
    else{
        response.send({
            success : false
        });
    }
});


app.post("/newquestion", function(request, response){
    q = new question();
    console.log(request.body);
    q.text = request.body.question;
    q.choices = request.body.choices;
    q.answer = request.body.answer;
    q.id = questionCounter++;

    questions[q.id] = q;

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
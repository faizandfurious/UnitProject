var student = {};
var questions = {"live": 0 , "array": []};//global data storage

function refreshDOM(){     

    var index = questions.live
    if (student.questions[index] === questions.array[index].answer){
        //display correct DOM effect
    }
    else{
        //display wrong answer screen and answer justification
    }
    
    //add a button click response to call choose function

}

//initial get method fill
// default to current question
// refresh question call checks index of current viewed question


function choose(ChoiceID){
    var index =  questions.live;
    student.question[index] = ChoiceID; //saves the student response in same array position as question
}

function questionResults(answers){
    var i = questions.live;
    questions.array[i].answer = answers.correctAnswer; //adds the answerID to client side object array
    questions.array[i].results = answers.studentAnswers; //adds class results for display
}

function getCorrectAnswer(question){
    $.ajax({
        type: "get",
        url: "/question/"+question.id,
        success: function(data){
            questionResults(data);
            refreshDOM();
        }
    })
}

function getStudentId(){
    $.ajax({
        type: "get",
        url: "/studentid",
        success: function(data){
            student.id = data; //saves the student id in array
            student.question = []; //starts an array for saving question responses
        }
    })
}

function nextQuestion(){
    $.ajax({
        type: "get",
        url: "/question",
        success: function(data){
            questions.live = questions.array.length();
            questions.array.push(data);
            refreshDOM();
        }
    })
}

function sendAnswer(question, choice){
    $.ajax({
        type: "post",
        url: "/question/"+question,
        data: {"id" : student.id, "answer" : student.question[questions.live]},
        success: function(data){
            refreshDOM()
        }
    })
}
    

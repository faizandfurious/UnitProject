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

function choose(ChoiceID){
    var index =  questions.live;
    student.question[index] = ChoiceID; //saves the student response in same array position as question
}

function questionResults(answers, id){
    questions.array[id].answer = answers.correctAnswer; //adds the answerID to client side object array
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
        data: {id : student.id, answer : student.question[questions.live]},
        success: function(data){
            questionResults(data.correctAnswer, question.live)
            refreshDOM()
        }
    })
}
    

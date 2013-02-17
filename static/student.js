var thingy; //global data storage

function RefreshDOM(){     
}

function answer(choice){
    //count the number of questions answered
    //student.questions += 1
    //save the students response
    //student.answer = question.choice
    //set the question 'state' to result, changing structure of DOM
    //question.state = result
    // display the correct answer somehow
    if (question.choice === question.correct){
        //need a question or student object element that effects DOM response as correct or incorrect
        //record the students correctness
        //student.correct+=1
        // display the correct answer somehow
    }
    else {
        //change DOM effecting object ot wrong
    }
}

//called after selecting the enxt question button
function nextQuestion(){
    //changes the current question   
}

function asdf(){
    $.ajax({
        type : "post",
        data: {},
        url : "/asdf",
        success: function(data){
        }
    })
}
    

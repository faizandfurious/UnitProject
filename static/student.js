var student = {};
var quiz = []

//______________________Cookie Code_____________________(taken off W3Schoolscom)
function getCookie(c_name)
{
var i,x,y,ARRcookies=document.cookie.split(";");
for (i=0;i<ARRcookies.length;i++)
  {
  x=ARRcookies[i].substr(0,ARRcookies[i].indexOf("="));
  y=ARRcookies[i].substr(ARRcookies[i].indexOf("=")+1);
  x=x.replace(/^\s+|\s+$/g,"");
  if (x==c_name)
    {
    return unescape(y);
    }
  }
}

function setCookie(c_name,value,exdays){
    var exdate=new Date();
    exdate.setDate(exdate.getDate() + exdays);
    var c_value=escape(value) + ((exdays===null) ? "" : "; expires="+exdate.toUTCString());
    document.cookie=c_name + "=" + c_value;
}

//This function checks to see if the username is saved as a cookie. If not, it prompts
//the user to enter their andrew ID. We then add the username to a cookie, and log the user in
function checkCookie(){
    var username=getCookie("username");

    if (username !== undefined){
        student.id = username;
        console.log("Student id is: " + student.id);
        $("#intro_panel").hide();
        $("#course_selection").show();
        setStudentId();
    }
    else{
        $("#course_selection").hide();
        $("#intro_panel").show();
    }
}
//________________http://www.w3schools.com/js/js_cookies.asp____________________    

//This function gets what the user entered into the login textbox, and saves it as an id.
$('#login').submit(function() {
    var arr = $('#login').serializeArray();
    student.id = arr[0].value;
    setStudentId();
    setCookie("username",student.id,365);

    $("#intro_panel").hide();
    $("#course_selection").show();
  return false;
});

//selections is an array of the clicked choices in the order of the quiz questions
function quizChoices (selections){
    var results = []
    for(var i = 0; i<selections.length; i++){
        var currentQuestion = quiz[i];
        results.push([currentQuestion , selections[i]]);
    }
    student.curr = results
    sendAnswers(results);
}


function setStudentId(){
    console.log("Now it's: " + student.id);
    $.ajax({
        type: "post",
        data: {studentId : student.id},
        url: "/studentId",
        success: function(data){
            console.log("Student Id is "+ data.studentId);
        }
    })
}

function getQuiz(){
    var interval = setInterval(function(){
        $.ajax({
            type: "get",
            url: "/getquestions",
            success: function(data){
                quiz = data;
                console.log(quiz);
                clearInterval(interval);
                setTimeout(getQuiz(),20000);
            }
        })
    }, 10000);

}

function sendAnswers(answersarray){
    $.ajax({
        type: "post",
        url: "/studentAnswer/"+student.id,
        data: { studentAnswers : answersarray},
        success: function(data){

        }
    })
}
    

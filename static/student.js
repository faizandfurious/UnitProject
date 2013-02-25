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

function setCookie(c_name,value,exdays)
{
var exdate=new Date();
exdate.setDate(exdate.getDate() + exdays);
var c_value=escape(value) + ((exdays===null) ? "" : "; expires="+exdate.toUTCString());
document.cookie=c_name + "=" + c_value;
}

function checkCookie()
{
var username=getCookie("username");
if (username!==null && username!=="")
  {
  alert("Welcome again " + username);
  }
else 
  {
  username=prompt("Please enter your andrewID:","");
  if (username!=null && username!="")
    {
    student.id = username
    setCookie("username",username,365);
    }
  }
}
//________________http://www.w3schools.com/js/js_cookies.asp____________________

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


function getStudentId(){
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
    $.ajax({
        type: "get",
        url: "/quiz",
        success: function(data){
            quiz = data
        }
    })
}

function sendAnswers(answersarray){
    $.ajax({
        type: "post",
        url: "/studentAnswers/"+student.id,
        data: { studentAnswers : answersarray},
        success: function(data){

        }
    })
}
    

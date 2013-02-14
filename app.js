var express = require("express"); // imports express
var app = express();        // create a new instance of express

// This is for serving files in the static directory
app.get("/static/:staticFilename", function (request, response) {
    response.sendfile("static/" + request.params.staticFilename);
});


function initServer() {
}

// Finally, initialize the server, then activate the server at port 8889
initServer();
app.listen(8889);
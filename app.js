var express = require("express");

app = express();

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

app.get("/", function(req, res){
    res.render("home");
});

app.get("/single", function(req, res) {
    res.render("single");
});

app.listen(3001, 'localhost', function() {
    console.log("... server starts in port 3001");
});

const express     = require("express"),
      app         = express(),
      handlebars  = require("express-handlebars").create({defaultLayout: "main"})
      bodyParser  = require("body-parser"),
      path        = require('path'),
      PORT        = process.env.PORT || 5000;

app.use(express.static('public'));
app.engine("handlebars", handlebars.engine);
app.set("view engine", "handlebars");
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
  
// ROOT ROUTE
app.get("/", function(req, res, next){
    res.render('home');
});

app.use(function(req, res){
    res.status(404);
    res.send('404');
});

app.use(function(err, req, res, next){
    console.error(err.stack);
    res.status(500);
    res.send('500');
});

app.listen(PORT, function(){
    console.log(`Express started on ${PORT}; press Ctrl-C to terminate.`);
});

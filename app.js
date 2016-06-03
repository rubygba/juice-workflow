// 在线测试页面
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var session = require('express-session');
var Http = require('./HttpRequestUtils');

var dir = (process.argv)[2] || './.temp';
console.log("process>>" + (process.argv)[2]);
// 静态文件目录
console.log("dirname>>" + __dirname + dir);
app.use(express.static(__dirname + dir));

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({
    extended: true
})); // for parsing application/x-www-form-urlencoded

app.use(session({
    secret: 'keyboard cat',
    cookie: {
        maxAge: 60000
    }
}));

function doResponse(req, res) {
    var file = req.params.name;
    console.log("req api: " + file);
    console.log("session: " + JSON.stringify(req.session.user));
    res.set('Content-Type', 'application/json');
    res.sendFile(__dirname + "/data/" + file);
}

app.get("/api/:name", function(req, res) {
    doResponse(req, res);
});

app.post("/api/:name", function(req, res) {
   doResponse(req, res);
});

/**
 * Proxy GET Request
 * @param  {[type]} req  [description]
 * @param  {[type]} res) {               var options [description]
 * @return {[type]}      [description]
 */
app.get("/remote/*", function(req, res) {
    var options = getOptions(req.originalUrl);
    Http.get(options).then(function(data) {
        return res.send(data);
    });
});

/**
 * Proxy POST Request
 * @param  {[type]} req  [description]
 * @param  {[type]} res) {               var body [description]
 * @return {[type]}      [description]
 */
app.post("/remote/*", function(req, res) {
    var body = req.body || undefined;
    var options = getOptions(req.originalUrl);
    if (body.length > 0) options = getOptions(req.originalUrl, body);
    Http.post(options).then(function(data) {
        return res.send(data);
    });
});


function getOptions(action, data) {
    var options = require("./config"); // Auth server
        options.path = action; // Set req url
    if (data) options.data = data; // Req body data
    return options;
}

var server = app.listen(3000, function() {
    var host = server.address().address;
    var port = server.address().port;
    console.log('Test app listening at http://%s:%s', host, port);
});
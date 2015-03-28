var http = require('http');
var mysql = require('mysql');

var port = 80;

http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end("Hello world");
}).listen(port);

console.log("Listening on port " + port);
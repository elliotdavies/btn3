var http = require('http');
var mysql = require('mysql');
var finalhandler = require('finalhandler');
var servestatic = require('serve-static');

// Settings for conneting to the MySQL database
var MySQL_options = {
    user: 'root',
    password: 'toor',
    host: 'localhost',
    port: '3306',
    database: 'btn'
};

var port = 80;

function getSingle(response, name) {
    var connection = mysql.createConnection(MySQL_options);
    connection.connect();

    // Query the database
    connection.query("SELECT * FROM Person WHERE name='" + name + "'",
        function(err, rows, fields) {
        if (err) {
            console.log("Invalid query", err);
            return;
        }
        console.log('MySQL responded with ', rows);
        response.writeHead(200, {'Content-Type': 'application/json'});
        response.end(JSON.stringify(rows));
    });

    connection.end();
}

function getList(response) {
    var connection = mysql.createConnection(MySQL_options);
    connection.connect();

    // Query the database
    connection.query("SELECT * FROM Person",
        function(err, rows, fields) {
        if (err) {
            console.log("Invalid query", err);
            return;
        }
        console.log('MySQL responded with ', rows);
        response.writeHead(200, {'Content-Type': 'application/json'});
        response.end(JSON.stringify(rows));
    });

    connection.end();
}

function getStatic(request, response, pathname) {
    var serve = servestatic("./");
    var done = finalhandler(request, response);
    serve(request, response, done);
}

http.createServer(function (request, response) {
    console.log("\nReceived request: " + request.url + " via " + request.method);

    // Parse request for URL path and specified service
    var parsed_URL = require('url').parse(request.url, true);
    var service = parsed_URL['query']['service'];

    if (service == undefined) {
        var pathname = parsed_URL['pathname'];
        getStatic(request, response, pathname);
    }

    // Avoid CORS errors
    response.setHeader("Access-Control-Allow-Origin", "*");

    if (service == 'single') {
        var name = parsed_URL['query']['name'];
        getSingle(response, name);
    }
    else if (service == 'list') {
        console.log("List");
        getList(response);
    }
}).listen(port);

console.log("Listening on port " + port);
var http = require('http'),
    url = require('url'),
    fs = require('fs');

var express = require('express');
var app = express();

var messages = ["Chat starts:"];
var clients = [];

/*
app.set('port', (process.env.PORT || 1337))
app.use(express.static(__dirname + '/'))

app.get('/', function(request, response) {
  response.send('Hello World!')
})

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'))
})*/

http.createServer(function (req, res) {
	
   // parse URL
   var url_parts = url.parse(req.url);
   console.log(url_parts);
   if(url_parts.pathname == '/') {
      // file serving
      fs.readFile('./index.html', function(err, data) {
         res.end(data);
      });
   } 
   else if(url_parts.pathname.substr(0, 5) == '/poll') {
			var count = url_parts.pathname.replace(/[^0-9]*/, '');
			console.log(count);
			if(messages.length > count) {
			  res.end(JSON.stringify( {
			    count: messages.length,
			    append: messages.slice(count).join("\n")+"\n"
			  }));
			} else {
			  clients.push(res);
			}
    } else if(url_parts.pathname.substr(0, 5) == '/msg/') {
    	 // message receiving
		  var msg = unescape(url_parts.pathname.substr(5));
		  messages.push(msg);
		  while(clients.length > 0) {
		    var client = clients.pop();
		    client.end(JSON.stringify( {
		      count: messages.length,
		      append: msg+"\n"
		    }));
		  }
		  res.end();
    }
}).listen(1337);
console.log('Server running at http://localhost:1337/');
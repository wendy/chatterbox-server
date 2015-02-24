/*************************************************************

You should implement your request handler function in this file.

requestHandler is already getting passed to http.createServer()
in basic-server.js, but it won't work as is.

You'll have to figure out a way to export this function from
this file and include it in basic-server.js so that it actually works.

*Hint* Check out the node module documentation at http://nodejs.org/api/modules.html.

**************************************************************/
var fs = require('fs');

module.exports = {};

module.exports.requestHandler = function(request, response) {
  // Request and Response come from node's http module.
  //
  // They include information about both the incoming request, such as
  // headers and URL, and about the outgoing response, such as its status
  // and content.
  //
  // Documentation for both request and response can be found in the HTTP section at
  // http://nodejs.org/documentation/api/

  // Do some basic logging.
  //
  // Adding more logging to your server can be an easy way to get passive
  // debugging help, but you should always be careful about leaving stray
  // console.logs in your code.
  console.log("Serving request type " + request.method + " for url " + request.url);

  // The outgoing status.
  var statusCode = 200;

  // See the note below about CORS headers.
  var headers = module.exports.defaultCorsHeaders;

  // Tell the client we are sending them plain text.
  //
  // You will need to change this if you are sending something
  // other than plain text, like JSON or HTML.
  headers['Content-Type'] = "application/json";

  // .writeHead() writes to the request line and headers of the response,
  // which includes the status and all headers.
  response.writeHead(statusCode, headers);

  // Make sure to always call response.end() - Node may not send
  // anything back to the client until you do. The string you pass to
  // response.end() will be the body of the response - i.e. what shows
  // up in the browser.
  //
  // Calling .end "flushes" the response's internal buffer, forcing
  // node to actually send all the data over to the client.

  if(request.method === 'POST'){
    var msg = '';
    request.on('data', function(chunk){
      msg += chunk;
    });

    request.on('end', function(){

      // open up our data file,
      // convert data into javascript object
      // push to msg to results key value
      // restringify the data object
      // save to file

      fs.readFile('/tmp/test2', {encoding: 'utf8'}, function(err, data){
        if(err){ console.log('could not open test2'); return;}

        console.log('write that file yo!');
        var file = JSON.parse(data);
        if( !file.results ){
          file.results = [];
        }
        file.results.push(msg);
        fs.writeFile("/tmp/test2", JSON.stringify(file), function(err) {
          if(err) {
              console.log(err);
          } else {
              console.log("The file was saved!");
          }
        });

      });

      // write the message in our data file
      // console.log(body);
      response.end('message posted');
    });

  }else if(request.method === 'GET' || 'OPTIONS'){
    // read the messages from our data file and return them
    fs.readFile('/tmp/test2',{encoding: 'utf8'}, function(err, data){
      if(!err) {
        console.log('data', data);
        response.end(JSON.stringify(data));
      }else{
        console.log('shhheeeeit');
        fs.writeFile("/tmp/test2", JSON.stringify({}), function(err){
          if(err){ console.log("did not write new file")}
        });
      }
    });
  }

};

// These headers will allow Cross-Origin Resource Sharing (CORS).
// This code allows this server to talk to websites that
// are on different domains, for instance, your chat client.
//
// Your chat client is running from a url like file://your/chat/client/index.html,
// which is considered a different domain.
//
// Another way to get around this restriction is to serve you chat
// client from this domain by setting up static file serving.
module.exports.defaultCorsHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10 // Seconds.
};


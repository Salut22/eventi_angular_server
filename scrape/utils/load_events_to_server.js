var fs          = require('fs');
var querystring = require('querystring');
var http        = require('http');

var HOST    = 'localhost';
var PORT    = '8080'; // porta localhost

var ROUTE   = '/admin/LoadEvent';
//var fileToRead = '../scrape_results/tuttocitta/tuttocitta.json';
//var fileToRead = '../scrape_results/sagre/sagre.json'
var fileToRead = '../scrape_results/virgilio/aosta.json'


//var readAndLoad = function(fileToRead)
// This is an async file read
// fs.readFile('./converted_pois.json', 'utf-8', function (err, data) {
fs.readFile(fileToRead, 'utf-8', function (err, data) {
  if (err) 
  {
    console.error("FATAL An error occurred trying to read in the file: " + err);
    process.exit(-2);
  }

  try
   {
    if(data) 
      {
        try {JSON.parse(data);}
        catch(e){ console.error("not valid json data: "+e); return;}
        // if it's valid json, go haead, using the string
        PostCodeToServer(data);
      }
    else 
      {
        console.log("No data to post");
        process.exit(-1);
      }
  }
catch(e){'error '+console.error(e);}
});


     
    

function PostCodeToServer(pois) {
  

  // An object of options to indicate where to post to
  var post_options = {
      //host: 'server.eppoi.eu',
      host: HOST,
      port: PORT,
      path: ROUTE,
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(pois)
      }
  };

  // Set up the request
  var post_req = http.request(post_options, function(res) {
      res.setEncoding('utf8');
      res.on('data', function (chunk) {
          console.log('Response: ' + chunk);
      });
  });

  // post the pois
  post_req.write(pois);
  post_req.end();

}

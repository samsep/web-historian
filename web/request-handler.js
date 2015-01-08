var path = require('path');
var archive = require('../helpers/archive-helpers');
var httpHelpers = require('./http-helpers');
// require more modules/folders here!


exports.handleRequest = function (req, res) {

  // res.end(archive.paths.list);
  if (req.method === 'GET') {
    if(req.url === '/' || httpHelpers.getAssetType(req.url)){
      httpHelpers.serveAssets(res, req.url, function(err, data){
        var headers = httpHelpers.headers;

        headers['Content-Type'] = httpHelpers.getAssetType(req.url);

        if(err) {
          res.writeHead(404, httpHelpers.headers);
          res.end();
        } else {
          res.writeHead(200, httpHelpers.headers);
          res.end(data);
        }
      });
    } else {
      //  its a website URL
      var url = req.url.substr(1);
      archive.isURLArchived(url, function(trueOrFalse){
        if(trueOrFalse){
          archive.loadArchivedUrl(url, function(err, html){
            // if true send saved version
            // res.send('archive.paths.archivedSites/' + body)
            var headers = httpHelpers.headers;
            headers['Content-Type'] = 'text/html';
            res.writeHead(200, headers);
            res.end(html);
          });
        } else {
          res.writeHead(404, httpHelpers.headers);
          res.end();
        }
      });
      //  check to see if its in the archive
      //  else throw a 404
    }
  } else if (req.method === 'POST' && req.url === '/') {

    // handle post
    // get body POST data (url)
    var body = '';
    req.on('data', function(data){
      // add data to body in chunks
      body += data;
    });
    req.on('end', function(){

      // split data to reveal url
      body = body.split('=')[1];
      body = decodeURIComponent(body);

      //check if url is in the list already
      archive.isUrlInList(body, function(inList){
        if (inList === true) {
          console.log('isURLInList', inList);
          archive.isURLArchived(body, function(trueOrFalse){
            if(trueOrFalse === true){
              archive.loadArchivedUrl(body, function(err, html){
                // if true send saved version
                // res.send('archive.paths.archivedSites/' + body)
                var headers = httpHelpers.headers;
                headers['Content-Type'] = 'text/html';
                res.writeHead(200, headers);
                res.end(html);
              });
            } else {
              // else scrape site and add to sites folder
              var headers = httpHelpers.headers;
              headers['Content-Type'] = 'text/html';
              httpHelpers.serveAssets(null, '/loading.html', function(err, page){
                res.writeHead(200, headers);
                res.end(page);
              });
            }
          });
          // callback
          // display the url from sites/www.google.com
          // check sites directory, res.end() with html in sites' file
        } else {
          // add to the list
          // scrape the site

          archive.addUrlToList(body, function(err, data){
            if (!err) {

              httpHelpers.serveAssets(null, '/loading.html', function(err, page){
                var headers = httpHelpers.headers;
                headers['Content-Type'] = 'text/html';
                res.writeHead(302, headers);
                res.end(page);
              });
            }
          });
        }
      });
    });

    // check to see if url exists in sites.txt
    // cb({
    //  res.send()
    // })
    // if it exists, serve the sites file
    // else, serve the loading.html and start a background process

  }
};

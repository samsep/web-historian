// eventually, you'll have some code here that uses the code in `archive-helpers.js`
// to actually download the urls you want to download.
var request = require('http-request');
var archive = require('../helpers/archive-helpers');
var fs = require('fs');

archive.readListOfUrls(function(err, urls){
  urls = urls.split("\n");
  urls.forEach(function(url){
    if(url.length){
      request.get(url, function(err, res){
        if (err) {
          console.error(err);
          return;
        }
        // console.log(url.substr(7));
        fs.writeFile(archive.paths.archivedSites + "/" + url.substr(7), res.buffer.toString(), function(err, data) {
          if (err) {
            console.log('error when writing');
          }
        });
      });
    }
  });
});

var path = require('path');
var fs = require('fs');
var archive = require('../helpers/archive-helpers');

module.exports.headers = headers = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10, // Seconds.
  'Content-Type': "text/html"
};

module.exports.serveAssets = function(res, asset, callback) {
  // Write some code here that helps serve up your static files!
  // (Static files are things like html (yours or archived from others...), css, or anything that doesn't change often.)
  if(asset === '/') asset = '/index.html';
  fs.readFile(__dirname + '/public' + asset, callback);
  console.log(asset);
};

module.exports.validFileTypes = {
  html: 'text/html',
  css: 'text/css'
};

module.exports.isAsset = function(url){
  console.log(this.getAssetType(url));
  return this.validFileTypes[this.getAssetType(url)] ? true : false;
};

module.exports.getAssetType = function(url) {
  return this.validFileTypes[url.split('.')[1]];
};


// As you progress, keep thinking about what helper functions you can put here!

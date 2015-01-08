var fs = require('fs');
var path = require('path');
var _ = require('underscore');
// var Promise = require('bluebird');

/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

module.exports.paths = {
  'siteAssets' : path.join(__dirname, '../web/public'),
  'archivedSites' : path.join(__dirname, '../archives/sites'),
  'list' : path.join(__dirname, '../archives/sites.txt')
};

// Used for stubbing paths for jasmine tests, do not modify
module.exports.initialize = function(pathsObj){
  _.each(pathsObj, function(path, type) {
    module.exports.paths[type] = path;
  });
};

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!

module.exports.readListOfUrls = function(callback){
  fs.readFile(this.paths.list, 'utf8', callback);
};

module.exports.isUrlInList = function(url, callback){
  this.readListOfUrls(function(err, data) {
    data = data.split("\n");
    if(data.indexOf(url) > -1){
      // we have a match
      callback(true);
    } else {
      // not present, do a html fetcher thing
      callback(false);
    }
  });
};

module.exports.addUrlToList = function(url, callback){
  fs.appendFile(this.paths.list, url + "\n", callback);
};

module.exports.loadArchivedUrl = function(url, callback){
  url = url.substr(0, 7) === 'http://' ? url.substr(7) : url;
  fs.readFile(this.paths.archivedSites + '/' + url, callback);
};

module.exports.isURLArchived = function(url, callback){
  url = url.substr(0, 7) === 'http://' ? url.substr(7) : url;
  fs.readdir(this.paths.archivedSites, function(err, directory){
    if(directory.indexOf(url) !== -1){
      callback(true);
    } else {
      callback(false);
    }
  });
};

module.exports.downloadUrls = function(file){
  //fetch url's code fr site.
  this.readListOfUrls()
};


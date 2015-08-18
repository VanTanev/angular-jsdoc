'use strict';

var spawn = require('child_process').spawn;
var extend = require('util')._extend;
var path = require('path');
var Q = require('q');

/**
 * execute shell command
 */
var runCommand = function(cmd, args) {
  var deferred = Q.defer();

  console.log("angularJsdoc Running command\n", cmd, args.join(" "));
  var child = spawn(cmd,args), result="";
  child.stdout.on("data", function(data) {
    result += data; 
  });
  child.stderr.on("data", function(data) {result += data;});
  child.stdout.on("end",  function() {deferred.resolve(result);});

  return deferred.promise;
};

/**
 * main function
 */
var angularJsdoc = function(dirs, optionsArg) {
  dirs = Array.isArray(dirs) ? dirs : dirs.split(" ");
  //default values
  var options = extend({
      configure: path.join(__dirname, "common", "conf.json"),
      template: path.join(__dirname, "templates", "default"),
      destination: "docs"
    }, optionsArg); 
  // if given template a single word including dash
  if (optionsArg.template && optionsArg.template.match(/^[\w-]+$/i)) {
    options.template = path.join(__dirname, "templates", optionsArg.template);
  };

  var cmd = path.join(__dirname, "node_modules", "jsdoc", "jsdoc.js");
  var args = [
    '--configure', options.configure,
    '--template', options.template,
    '--destination', options.destination,
    (options.readme||'')
  ];
  args = args.concat(['--recurse']).concat(dirs);
  runCommand(cmd, args).then(function(output) {
    console.log('DONE', output);
  });
};

module.exports = angularJsdoc;

angularJsdoc(['sample-codes'], {
//  //template: 'default', 
  readme: "sample-codes/README.md"
});

//angularJsdoc(['../angularjs-google-maps/directives', '../angularjs-google-maps/services'], {
//  //template: 'default', 
//  readme: "../angularjs-google-maps/README.md"
//});

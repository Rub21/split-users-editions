#!/usr/bin/env node

var fs = require('fs');
var readline = require('readline');
var mbxusers = require('mapbox-data-team').getUsernames();
mbxusers = mbxusers.reduce(function(memo, currentValue) {
  memo[currentValue.toString()] = true;
  return memo;
}, {});

module.exports = {
  filter: function(file) {
    var rd = readline.createInterface({
      input: fs.createReadStream(file),
      output: process.stdout,
      terminal: false
    });

    rd.on('line', function(line) {
      var obj = JSON.parse(line);
      var users = {
        "type": "FeatureCollection",
        "features": []
      };
      obj.features.forEach(function(val) {
        if (mbxusers.hasOwnProperty(val.properties['@user'])) {
          users.features.push(val);
        }
      });
      if (lastedits.features.length > 0) {
        process.stdout.write(JSON.stringify(users) + '\n');
      }
    }).on('close', function() {});
  }
};
#!/usr/bin/env node
var fs = require('fs');
var readline = require('readline');
var time = require('time')(Date);
var yesterday = (time.time() - (2 * 24 * 60 * 60 + 12 * 60 * 60));
var argv = require('minimist')(process.argv.slice(2));

var users_latest = {};
var users_lastDay = {};
var rd = readline.createInterface({
  input: fs.createReadStream(argv._[0]),
  output: process.stdout,
  terminal: false
});

rd.on('line', function(line) {
  var obj = JSON.parse(line);
  obj.features.forEach(function(val) {
    //last 7 days editions
    if (users_latest[val.properties['@user']]) {
      users_latest[val.properties['@user']].features.push(val);
    } else {
      users_latest[val.properties['@user']] = {
        "type": "FeatureCollection",
        "features": [val]
      };
    }
    //yesterday editions
    if (val.properties['@timestamp'] > yesterday) {
      if (users_lastDay[val.properties['@user']]) {
        users_lastDay[val.properties['@user']].features.push(val);
      } else {
        users_lastDay[val.properties['@user']] = {
          "type": "FeatureCollection",
          "features": [val]
        };
      }
    }
  });
}).on('close', function() {
  for (var user in users_latest) {
    fs.writeFile('latest-' + user + '.geojson', JSON.stringify(users_latest[user]));
  }
  for (var usuario in users_lastDay) {
    fs.writeFile(date(yesterday) + '-' + usuario + '.geojson', JSON.stringify(users_latest[usuario]));
  }
});

function date(timestamp) {
  var date = new Date(timestamp * 1000);
  var mes = date.getMonth() + 1;
  var dia = date.getDate();
  var year = date.getFullYear();
  return year + "-" + mes + "-" + dia;
}
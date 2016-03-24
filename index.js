var http = require('http');
var https = require('https');
var chalk = require('chalk');

// Process args
var names = process.argv.slice(2);

if (!names.length) {
  console.log('what name(s) should I search for?');
  process.exit(1);
}

var checked = [],
    pos = 0;

names.forEach(function(name, i){
  https.request({
    method: 'HEAD',
    hostname: 'registry.npmjs.org',
    path: '/' + name
  })
  .on('response', function (res) {
    collectResult(null, res, i, name);
  })
  .on('error', function (err) {
    collectResult(err, null, i, name);
  })
  .end();
});

function collectResult (err, res, i, name) {
  if (checked[i]) return;
  checked[i] = res || {};
  checked[i].name = name;
  checked[i].err = err;
  report();
}

function report () {
  var current;
  for (; checked[pos]; pos++) {
    current = checked[pos];
    if (current.statusCode === 200) {
      console.log(chalk.grey(current.name, 'is unavailable: https://www.npmjs.org/package/' + current.name));
    } else if (current.statusCode === 404) {
      console.log(chalk.green(current.name), 'is available!');
    } else if (current.err) {
      console.error(current.name, chalk.red(current.err));
    } else if (current.timeout) {
      console.error(current.name, chalk.yellow('timed out'));
    } else {
      console.error(current.name, chalk.magenta(current.statusCode, http.STATUS_CODES[current.statusCode]));
    }
    if (pos === names.length - 1) process.exit(0);
  }
}

var TIME = 3000;
setTimeout(function(){
  console.error(chalk.yellow('\nTimed out after', TIME / 1000, 'seconds\n'));
  for (var i = pos; i < names.length; i++) {
    if (!checked[i]) checked[i] = { timeout: true, name: names[i] };
  }
  report();
  process.exit(1);
}, TIME);

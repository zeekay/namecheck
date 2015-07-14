var request = require('request');
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
  request.head('https://registry.npmjs.org/' + name, function(err, res) {
    checked[i] = res || {};
    checked[i].name = name;
    checked[i].err = err;
    report();
  });
});

function report () {
  var current;
  for (; checked[pos]; pos++) {
    current = checked[pos];
    if (current.statusCode === 200) {
      console.log(current.name, 'is unavailable: https://www.npmjs.org/package/' + current.name);
    } else if (current.statusCode === 404) {
      console.log(chalk.green(current.name), 'is available!');
    } else if (current.err) {
      console.error(chalk.red('error checking'), current.name);
      console.error(chalk.gray(current.err));
    } else if (current.timeout) {
      console.error(chalk.yellow(current.name, 'timed out'));
    } else {
      console.error(chalk.blue(current.name, 'had status code', current.statusCode));
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

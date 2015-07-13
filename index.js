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
  request('https://registry.npmjs.org/' + name, function(err, res) {
    checked[i] = res || {};
    checked[i].name = name;
    report();
  });
});

function report () {
  var current;
  for (; checked[pos]; pos++) {
    current = checked[pos];
    if (current.statusCode === 200) {
      console.log(current.name + ' is unavailable: https://www.npmjs.org/package/' + current.name);
    } else if (current.statusCode === 404) {
      console.log(chalk.green(current.name) + ' is available!');
    } else {
      console.log(chalk.red('something went wrong checking'), current.name);
    }
    if (pos === names.length - 1) process.exit(0);
  }
}

var TIME = 3000;
setTimeout(function(){
  console.error(chalk.yellow('Timed out after', TIME / 1000, 'seconds'));
  process.exit(1);
}, TIME);

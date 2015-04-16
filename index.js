var request = require('request');

// Process args
var name = process.argv.slice(2)[0];

if (name == null) {
  console.log('what name should I search for?');
  process.exit(1);
}

request('https://www.npmjs.org/package/' + name, function(err, res) {
  if (res.statusCode === 200) {
    console.log(name + ' is unavailable: https://www.npmjs.org/package/' + name);
  } else if (res.statusCode === 404) {
    console.log(name + ' is available!');
  } else {
    console.log('something went wrong!');
    process.exit(1)
  }
  process.exit(0)
});

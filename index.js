var https = require('https'),
    name = process.argv.slice(2)[0];

if (name == null) {
  console.log('what name should I search for?');
  process.exit(1);
}

https.get('https://npmjs.org/package/' + name, function(res) {
  if (res.statusCode === 200) {
    console.log(name + ' is unavailable: https://npmjs.org/package/' + name);
  } else if (res.statusCode === 404) {
    console.log(name + ' is available!');
  } else {
    console.log('something went wrong!');
  }
});
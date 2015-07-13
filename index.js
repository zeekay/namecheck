var request = require('request');

// Process args
var names = process.argv.slice(2);

if (!names.length) {
  console.log('what name(s) should I search for?');
  process.exit(1);
}

var checked = 0;
names.forEach(function(name){
  request('https://registry.npmjs.org/' + name, function(err, res) {
    checked++;
    if (res.statusCode === 200) {
      console.log(name + ' is unavailable: https://www.npmjs.org/package/' + name);
    } else if (res.statusCode === 404) {
      console.log(name + ' is available!');
    } else {
      console.log('something went wrong checking', name);
      if (err) console.error(err);
    }
    if (checked === names.length) process.exit(0);
  });
});

var TIME = 3000;
setTimeout(function(){
  console.error('Timed out after', TIME / 1000, 'seconds' );
  process.exit(1);
}, TIME);

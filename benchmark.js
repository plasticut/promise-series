const Benchmark = require('benchmark');
const {eachSeries1, eachSeries2, eachSeries3, eachSeries4} = require('./each');

const memwatch = require('memwatch-next');

memwatch.on('leak', function(info) {
  console.log('Memwatch leak: ');
  console.log(info);
});

memwatch.on('stats', function(stats) {
  console.log('Memwatch stats: ');
  console.log(stats);
});

function iterator(item, index) {
  return new Promise(resolve => {
    process.nextTick(() => {
      resolve(item+index);
    });
  });
}

const data = (new Array(100)).fill(0).map((item, index) => index);

const suite = new Benchmark.Suite;

suite
.add('eachSeries1', function(deferred) {
  eachSeries1(data, iterator)
    .then(() => deferred.resolve())
    .catch(() => deferred.reject());
}, {defer: true})

.add('eachSeries2', function(deferred) {
  eachSeries2(data, iterator)
    .then(() => deferred.resolve())
    .catch(() => deferred.reject());
}, {defer: true})

.add('eachSeries3', function(deferred) {
  eachSeries3(data, iterator)
    .then(() => deferred.resolve())
    .catch(() => deferred.reject());
}, {defer: true})

.add('eachSeries4', function(deferred) {
  eachSeries4(data, iterator)
    .then(() => deferred.resolve())
    .catch(() => deferred.reject());
}, {defer: true})

.on('cycle', function(event) {
  console.log(String(event.target));
})
.on('complete', function() {
  console.log('Fastest is ' + this.filter('fastest').map('name'));
})
.run({async: true});

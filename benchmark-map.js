require('colors');
const Benchmark = require('benchmark');
const {mapSeries1, mapSeries2} = require('./map');

const memwatch = require('memwatch-next');

memwatch.on('leak', function(info) {
  console.log('Memwatch leak: '.red);
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

const data = (new Array(50)).fill(0).map((item, index) => index);

const suite = new Benchmark.Suite;

suite
.add('mapSeries1', function(deferred) {
  mapSeries1(data, iterator)
    .then(() => deferred.resolve())
    .catch(e => {
 throw e;
});
}, {defer: true})

.add('mapSeries2', function(deferred) {
  mapSeries2(data, iterator)
    .then(() => deferred.resolve())
    .catch(e => {
 throw e;
});
}, {defer: true})

.on('cycle', function(event) {
  console.log(String(event.target).cyan);
})
.on('complete', function() {
  console.log(('Fastest is ' + this.filter('fastest').map('name')).green);
})
.run();

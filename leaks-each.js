require('colors');
const {eachSeries1} = require('./each');

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

const data = (new Array(100)).fill(0).map((item, index) => index);

const hd = new memwatch.HeapDiff();

const promises = [];
for (let i=0; i<100; i++) {
  promises.push(eachSeries1(data, iterator));
}

Promise.all(promises).then(data => {
  const hde = hd.end();

  console.log(JSON.stringify(hde, null, 2));
});

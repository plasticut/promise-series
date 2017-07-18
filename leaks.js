const {eachSeries1} = require('./each');

const memwatch = require('memwatch-next');

memwatch.on('leak', function(info) {
  console.log('Memwatch leak: ');
  console.log(info);
});

memwatch.on('stats', function(stats) {
  console.log('Memwatch stats: ');
  console.log(stats);
});

const hd = new memwatch.HeapDiff();

function iterator(item, index) {
  return new Promise(resolve => {
    process.nextTick(() => {
      resolve(item+index);
    });
  });
}
const data = (new Array(20)).fill(0).map((item, index) => index);

const promises = [];
for (let i=0; i<10000; i++) {
  promises.push(eachSeries1(data, iterator));
}

Promise.all(promises).then(() => {
  const hde = hd.end();

  console.log(JSON.stringify(hde, null, 2));
});

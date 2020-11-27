const WhereBuilder = require('./WhereBuilder');

const request = {
  firstname: 'Abdulsalam',
  lastname: 'Amenov',
};
// const raw = ['lastname'];
const raw = [['name', 'firstname', { a: 1 }]];

const where = new WhereBuilder(request, raw).get();

console.log(where.__proto__ === Object.prototype);
console.log(where);

/*
[
  {},
  'whereKeyAndRequestKey',
  ['whereKey', 'requestKey'],
  ['whereKeyAndRequestKey', {}],
  ['whereKey', () => 'value'],
  ['whereKey', 'requestKey', {}],
  [null, 'requestKey', {}]
]
*/

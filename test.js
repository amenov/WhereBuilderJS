const WhereBuilder = require('./WhereBuilder');

const query = {
  firstname: 'Abdulsalam',
  name: 'Abdulsalam',
  just: 'simple',
};
const abstractions = [
  'firstname',
  ['name', 'firstname'],
  ['func', () => true],
  ['just', { just: query.just }],
  ['object', 'name', { test: true }],
  [null, 'name', { test: true }],
  ['object_func', 'name', () => ({ object_func: true })],
  [null, 'name', () => ({ null_func: true })],
];

whereBuilder = new WhereBuilder(query, abstractions);

try {
  whereBuilder.run();

  const where = whereBuilder.where;

  console.log(where);
} catch (err) {
  console.log(err);
}

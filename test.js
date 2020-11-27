const WhereBuilder = require('./WhereBuilder');

const request = {
  lastname: 'Amenov',
};
const raw = ['lastname'];

const where = new WhereBuilder(request, raw).parse();

console.log(where.__proto__ === Object.prototype);
console.log(where);

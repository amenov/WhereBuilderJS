module.exports = class WhereBuilder {
  constructor(request, raw) {
    this.request = request;
    this.raw = raw;
  }

  where = {};

  gens = [
    { Type: String, method: 'genString' },
    { Type: Array, method: 'genArray' },
    { Type: Object, method: 'genObject' },
  ];

  genString(str) {
    if (this.request[str]) {
      this.where[str] = this.request[str];
    } else {
      console.log('Key not found in request');
    }
  }

  genArray(arr) {
    if (arr.length == 2) {
      if (typeof arr[1] === 'string') {
        const [whereKey, queryKey] = arr;

        if (this.request[queryKey]) {
          this.where[whereKey] = this.request[queryKey];
        } else {
          console.log('Key not found in request');
        }

        return;
      }

      if (arr[1].__proto__ === Object.prototype) {
        const [whereKey, obj] = arr;

        this.where[whereKey] = obj;

        return;
      }

      if (typeof arr[1] === 'function') {
        const [whereKey, cb] = arr;

        const result = cb();

        if (result !== undefined && result !== '') {
          this.where[whereKey] = result;
        } else {
          console.log('Invalid value');
        }

        return;
      }

      return;
    }

    if (arr.length == 3) {
      if (typeof arr[0] === 'string' && arr[2].__proto__ === Object.prototype) {
        const [whereKey, queryKey, obj] = arr;

        if (this.request[queryKey]) {
          this.where[whereKey] = obj;

          return;
        }

        return;
      }

      if (arr[0] === null && arr[2].__proto__ === Object.prototype) {
        const [, queryKey, obj] = arr;

        if (this.request[queryKey]) {
          this.where = { ...this.where, ...obj };

          return;
        }

        return;
      }

      return;
    }
  }

  genObject(obj) {
    this.where = { ...this.where, ...obj };
  }

  get() {
    for (const el of this.raw) {
      for (const gen of this.gens) {
        if (el.__proto__ === gen.Type.prototype) {
          this[gen.method](el);

          break;
        }
      }
    }

    return this.where;
  }
};

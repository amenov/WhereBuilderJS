module.exports = class WhereBuilder {
  constructor(query, abstractions) {
    this.query = query;
    this.abstractions = abstractions;
  }

  where = {};

  methods = [
    { Type: String, method: '__string' },
    { Type: Array, method: '__array' },
    { Type: Object, method: '__object' },
  ];

  __getQueryData(key) {
    const data = this.query[key];

    if (data !== undefined) {
      if (typeof data === 'string') {
        return data;
      } else {
        throw TypeError('Expected string');
      }
    }
  }

  // 'whereKeyRequestKey'
  __string(str) {
    const data = this.__getQueryData(str);

    if (data) {
      this.where[str] = data;
    }
  }

  __array(arr) {
    if (arr.length == 2) {
      // ['whereKey', 'requestKey']
      if (typeof arr[1] === 'string') {
        const [whereKey, requestKey] = arr;

        const data = this.__getQueryData(requestKey);

        if (data) {
          this.where[whereKey] = data;
        }

        return;
      }

      // ['whereKeyRequestKey', Object]
      if (arr[1].constructor === Object) {
        const [whereKeyRequestKey, obj] = arr;

        if (this.__getQueryData(whereKeyRequestKey)) {
          this.where[whereKeyRequestKey] = obj;
        }

        return;
      }

      // ['whereKey', Function]
      if (typeof arr[1] === 'function') {
        const [whereKey, cb] = arr;

        const result = cb();

        if (result !== undefined && result !== '') {
          this.where[whereKey] = result;
        }

        return;
      }

      return;
    }

    if (arr.length == 3) {
      // ['whereKey' || null, 'requestKey', Object]
      if (arr[2].constructor === Object) {
        const [whereKey, requestKey, obj] = arr;

        if (this.__getQueryData(requestKey)) {
          if (whereKey !== null) {
            this.where[whereKey] = obj;
          } else {
            this.where = { ...this.where, ...obj };
          }
        }

        return;
      }

      // ['whereKey' || null, 'requestKey', Function]
      if (typeof arr[2] === 'function') {
        const [whereKey, requestKey, cb] = arr;

        const result = cb();

        if (
          this.__getQueryData(requestKey) &&
          result !== undefined &&
          result !== ''
        ) {
          if (whereKey !== null) {
            this.where[whereKey] = result;
          } else {
            this.where = { ...this.where, ...result };
          }
        }

        return;
      }
    }
  }

  __object(obj) {
    this.where = { ...this.where, ...obj };
  }

  run() {
    if (this.abstractions.length) {
      for (const abstraction of this.abstractions) {
        for (const { Type, method } of this.methods) {
          if (abstraction.constructor === Type) {
            this[method](abstraction);

            break;
          }
        }
      }
    }
  }
};

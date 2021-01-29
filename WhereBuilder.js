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

  __checkType(val, Type) {
    return val.__proto__ === Type.prototype;
  }

  __getQueryData(key) {
    const data = this.query[key];

    if (data !== undefined) {
      if (this.__checkType(data, String)) {
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
      if (this.__checkType(arr[1], String)) {
        const [whereKey, requestKey] = arr;

        const data = this.__getQueryData(requestKey);

        if (data) {
          this.where[whereKey] = data;
        }

        return;
      }

      // ['whereKeyRequestKey', Object]
      if (this.__checkType(arr[1], Object)) {
        const [whereKeyRequestKey, obj] = arr;

        if (this.__getQueryData(whereKeyRequestKey)) {
          this.where[whereKeyRequestKey] = obj;
        }

        return;
      }

      // ['whereKey', Function]
      if (this.__checkType(arr[1], Function)) {
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
      if (this.__checkType(arr[2], Object)) {
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
      if (this.__checkType(arr[2], Function)) {
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
          if (this.__checkType(abstraction, Type)) {
            this[method](abstraction);

            break;
          }
        }
      }
    }
  }
};

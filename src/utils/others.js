exports.clone = (obj) => JSON.parse(JSON.stringify(obj));

exports.mergeRename = (objects, names) => {
  const result = {};
  for (let i = 0; i < objects.length; i++) {
    for (let key in objects[i]) {
      result[key + names[i]] = clone(objects[i][key]);
    }
  }
  return result;
};

exports.mergeKeysValues = (keys, values) =>
  keys.reduce((map, key, i) => {
    map[key] = values[i];
    return map;
  }, {});

exports.capitalize = (s) => s[0].toUpperCase() + s.slice(1);

exports.getFileDate = () => {
  const date = new Date();
  return `${date.getDate()}-${
    date.getMonth() + 1
  }-${date.getFullYear()}_${date.getHours()}-${date.getMinutes()}`;
};

exports.countKeys = (obj) => {
  let n = 0;
  for (let key in obj) n++;
  return n;
};

exports.randInt = (min, max) => {
  if (isNaN(max)) {
    max = min;
    min = 0;
  }
  return (Math.random() * (max - min) + min) & 1;
};

exports.constraint = (val, [min, max]) => Math.max(min, Math.min(max, val));

exports.getPercentage = (val, [min, max]) =>
  constraint(Math.round(((val - min) / (max - min)) * 100), [0, 100]);

exports.getNested = (obj, key) =>
  key
    .split('.')
    .reduce(
      (o, k, i, a) =>
        Object.is(o[k], void 0) ? (i < a.length - 1 ? {} : o[k]) : o[k],
      obj
    );

exports.debounce = (fn, ms) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(fn, ms, ...args);
  };
};

exports.getPowerFromFlow = (n) =>
  exports.constraint(Math.round(0.0019 * n * n - 0.36 * n), [0, 100]);

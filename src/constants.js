const IS_RPI = process.platform === 'linux' && process.arch == 'arm';

// идентификаторы серийного порна для rapberry OS и windows
const PORT = {
  name: IS_RPI ? '/dev/serial0' : 'COM5',
  baudRate: 230400,
};

// разделители
const SEPARATORS = Buffer.alloc(4);
SEPARATORS.writeUInt16BE(18735);
SEPARATORS.writeUInt16BE(869, 2);

// однобайтовые значения
const STATE_DATA = [
  'mode',
  'loadMode',
  'cellDcDcOnOff',
  'cellBusOnOff',
  'cellLoadOnOff',
  'batteryLoadOnOff',
  'batteryBusOnOff',
  'PSUOnOff',
  'pumpOnOff',
  'batChargeOnOff',
];

/* динамическое отключение некоторых переключателей
пары ключ-значение, где
значение - переключатели, которые нужно отключить при включении ключа */
const EXCLUDING_SWITCHES = {
  cellDcDc: ['cellLoad', 'cellBus'],
  cellBus: ['cellDcDc'],
  cellLoad: ['batteryLoad', 'cellDcDc'],
  batteryLoad: ['cellLoad', 'batteryBus'],
  batteryBus: ['batteryLoad'],
  // PSU: ['cellBus'],
};

// двубайтовые значения
const IV_DATA = [
  'cellVoltage',
  'cellCurrent',
  'setLoad',
  'batVoltage',
  'batCurrent',
  'busVoltage',
];
// на что делить полученные значения
const IV_DIVIDERS = [1000, 1000, 10, 1000, 1000, 1000];

// общая длина массива
const DATA_BYTE_LENGTH =
  STATE_DATA.length + IV_DATA.length * 2 + SEPARATORS.length;

// комманды для отправки, функции прнимающие значение и возвращающие массив для отправки
const COMMANDS = {
  cellLoadSwitch: (v) => [4, v],
  batteryLoadSwitch: (v) => [8, v],
  cellDcDcSwitch: (v) => [12, v],
  cellBusSwitch: (v) => [16, v],
  batteryBusSwitch: (v) => [20, v],
  PSUSwitch: (v) => [24, v],
  pumpSwitch: (v) => [28, v],
  setLoadMode: (v) => [32, v],
  setLoad: (v) => [36, v * 10],
  cellChargeMode: (v) => [40, v],
  batteryChargeMode: (v) => [44, v],
};

// ограничения полей ввода
const CONSTRAINTS = {
  voltageCharge: [8, 16],
  currentCharge: [0, 2.5],
  voltageDischarge: [8, 16],
  currentDischarge: [0, 2.5],
  pumpPower: [0, 100],
};

module.exports = {
  IS_RPI,
  PORT,
  SEPARATORS,
  COMMANDS,
  IV_DATA,
  STATE_DATA,
  DATA_BYTE_LENGTH,
  CONSTRAINTS,
  IV_DIVIDERS,
  EXCLUDING_SWITCHES,
};
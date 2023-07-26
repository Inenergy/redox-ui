const IS_RPI = process.platform === 'linux' && process.arch == 'arm';

// Идентификатор серийного порта для linux и windows
const PORT = {
  name: IS_RPI ? '/dev/serial0' : 'COM5',
  baudRate: 230400,
};

// разделители
const SEPARATORS = Buffer.alloc(4);
SEPARATORS.writeUInt16BE(18735);
SEPARATORS.writeUInt16BE(869, 2);

// однобайтовые значения
const STATE_DATA = ['pumpPower', 'loadMode', 'ligtingOn', 'mode']; 

// двубайтовые значения
const IV_DATA = ['voltage', 'current', 'setLoad']; 
const IV_DIVIDERS = [1000, 1000, 10];

// общая длина массива для проверки приема данных
const DATA_BYTE_LENGTH =
  STATE_DATA.length + IV_DATA.length * 2 + SEPARATORS.length;

/* Комманды
Либо просто массив для комманд без ввода данных
Либо функция, которая принимает значение и возвращает массив для отправки */
const COMMANDS = {
  turnOffLighting: [4, 0],
  turnOnLighting: [8, 0],
  start: [12, 0],
  stop: [16, 0],
  setPumpPower: (v) => [20, v],
  setMode: (v) => [24, v],
  setLoadMode: (v) => [28, v],
  setLoad: (v) => [32, v * 10],
};

// ограничения на полях ввода
const CONSTRAINTS = {
  voltageParallel: [0, 1.7],
  voltageSeries: [0, 6.8],
  currentParallel: [0, 1.5],
  currentSeries: [0, 1.5],
  pumpFlow: [200, 350],
};

CONNECTION_TYPES = ['series', 'parallel'];

module.exports = {
  IS_RPI,
  PORT,
  SEPARATORS,
  COMMANDS,
  IV_DATA,
  STATE_DATA,
  DATA_BYTE_LENGTH,
  CONSTRAINTS,
  CONNECTION_TYPES,
  IV_DIVIDERS,
};

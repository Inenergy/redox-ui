const { Workbook } = require('excel4node');
const path = require('path');

let wb,
  ws,
  fileName,
  headerStyle,
  dataStyle,
  fileNumber = 1,
  row = 1;

function createFile(name, headers) {
  fileName = `${name}_${fileNumber++}.xlsx`;
  wb = new Workbook();
  ws = wb.addWorksheet('Results');
  row = 1;
  if (!headerStyle) createStyles();
  for (let i = 0; i < headers.length; i++) {
    ws.cell(row, i + 1)
      .string(headers[i])
      .style(headerStyle);
  }
  row++;
}

function writeRow(entries) {
  if (!ws) return;
  for (let i = 0; i < entries.length; i++) {
    ws.cell(row, i + 1)
      .number(entries[i])
      .style(dataStyle);
  }
  row++;
}

function saveFile(dir, cb = () => {}) {
  wb.write(path.join(dir, fileName), cb);
}

function createStyles() {
  headerStyle = wb.createStyle({
    font: {
      bold: true,
      color: 'ffffff',
    },
    fill: {
      type: 'pattern',
      patternType: 'solid',
      fgColor: '8bc041',
    },
  });
  headerStyle.border = generateBorders();
  dataStyle = wb.createStyle({
    alignment: {
      horizontal: 'right',
    },
  });
  dataStyle.border = generateBorders();
}

function generateBorders() {
  return ['left', 'right', 'top', 'bottom'].reduce(
    (acc, key) => {
      acc[key] = {
        style: 'thin',
        color: 'black',
      };
      return acc;
    },
    { outline: false }
  );
}

module.exports = {
  writeRow,
  createFile,
  saveFile,
};

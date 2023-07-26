<script>
  import Select from '../molecules/Select';
  import Button from '../atoms/Button';
  import SaveButton from '../organisms/SaveButton';
  import { ipcRenderer } from 'electron';
  import Chart from 'chart.js';
  import 'chartjs-plugin-zoom';
  import 'chartjs-plugin-downsample';
  import configureChart from './chart.config';
  import { onMount } from 'svelte';
  import {
    IVData,
    mode,
    stateData,
    connectionType,
    storedEnergy,
    storedCharge,
  } from '../stores';
  import { CONNECTION_TYPES, COMMANDS } from '../constants';
  import pointsStorage from '../utils/pointsStorage';
  import { __ } from '../utils/translations';

  onMount(() => {
    chart = new Chart(
      document.getElementById('chart').getContext('2d'),
      configureChart(pointsStorage.points, { x: xAxis.symbol, y: yAxis.symbol })
    );
    chart.options.onClick = chart.resetZoom;
  });

  const xOptions = [
    { label: 'time', value: 0, symbol: 't, s' },
    { label: 'voltage', value: 1, symbol: 'U, V' },
  ];

  const yOptions = [
    { label: 'current', value: 2, symbol: 'I, A' },
    { label: 'voltage', value: 1, symbol: 'U, V' },
  ];

  let saveDisabled = true,
    isDrawing,
    unsubscribeData,
    isCharging = $stateData.mode,
    xAxis = xOptions[0],
    yAxis = yOptions[0],
    chart,
    timeStart;

  $: if (chart && xAxis) {
    pointsStorage.setX(xAxis.value);
    chart.options.scales.xAxes[0].scaleLabel.labelString = xAxis.symbol;
    chart.update();
  }

  $: if (chart && yAxis) {
    pointsStorage.setY(yAxis.value);
    chart.options.scales.yAxes[0].scaleLabel.labelString = yAxis.symbol;
    chart.update();
  }

  function toggleDrawing() {
    if (isDrawing) {
      stopDrawing();
    } else {
      startDrawing();
    }
  }

  function startDrawing() {
    isDrawing = true;
    pointsStorage.drain();
    startLog();
    resetStored();
    ipcRenderer.send('serialCommand', COMMANDS.start);
    subscribeData();
  }

  function startLog() {
    const fileName = 'Redox';
    const headers = ['Time, s', 'Voltage, V', 'Current, A'];
    ipcRenderer.send('startLog', fileName, headers);
    saveDisabled = false;
  }

  function stopDrawing() {
    isDrawing = false;
    unsubscribeData();
    ipcRenderer.send('serialCommand', COMMANDS.stop);
  }

  function subscribeData() {
    timeStart = 0;
    isCharging = $stateData.mode;
    unsubscribeData = IVData.subscribe(addPoint);
  }

  function addPoint(iv) {
    pointsStorage.addRow([timeStart++, iv.voltage, iv.current]);
    ipcRenderer.send(
      'logRow',
      pointsStorage.rows[pointsStorage.rows.length - 1]
    );
    storedCharge.update(
      (charge) => charge + (iv.current * (isCharging ? 1 : -1)) / 3.6
    );
    storedEnergy.update(
      (energy) =>
        energy + (iv.current * iv.voltage * (isCharging ? 1 : -1)) / 3.6
    );
    updateChart();
  }

  function updateChart() {
    chart.data.datasets[0].data = pointsStorage.points;
    chart.update();
  }

  function resetStored() {
    storedCharge.set(0);
    storedEnergy.set(0);
  }
</script>

<div class="layout">
  <header>{$__('charts')}</header>
  <main>
    <h3>{$__('battery characteristics')}</h3>
    <div class="label">{$__('voltage, V')}</div>
    <div class="long-value">{$IVData.voltage}</div>
    <div class="label">{$__('current, A')}</div>
    <div class="long-value">{$IVData.current}</div>
    <div class="label">{$__('mode')}</div>
    <div class="long-value">{$mode ? $__('charge') : $__('discharge')}</div>
    <div class="label">{$__('connection type')}</div>
    <div class="long-value">{$__(CONNECTION_TYPES[$connectionType])}</div>
    <div class="short-label">{$__('x axis')}</div>
    <Select
      options={xOptions}
      defaultValue={xAxis.value}
      style="grid-column: 2 / 4"
      onChange={(i) => (xAxis = xOptions[i])}
    />
    <div class="short-label">{$__('y axis')}</div>
    <Select
      order={2}
      options={yOptions}
      defaultValue={yAxis.value}
      style="grid-column: 2 / 4"
      onChange={(i) => (yAxis = yOptions[+i % 2])}
    />
    <Button style="grid-area: 6 / 4 / 8 / 6" on:click={toggleDrawing}>
      {isDrawing ? $__('stop') : $__('start')}
    </Button>
    <div class="long-label">{$__('charge, mA*h')}</div>
    <div class="value">{$storedCharge | 0}</div>
    <div class="long-label">{$__('energy, mW*h')}</div>
    <div class="value">{$storedEnergy | 0}</div>
    <div class="chart">
      <canvas id="chart" height="400" width="520" />
    </div>
  </main>
  <footer>
    <Button on:click={() => window.scrollTo({ top: 0 })}>{$__('back')}</Button>
    <SaveButton disabled={saveDisabled} />
  </footer>
</div>

<style>
  main {
    display: grid;
    grid-template-columns: repeat(12, 1fr);
    grid-template-rows: repeat(10, 1fr);
    grid-column-gap: 24px;
    grid-row-gap: 8px;
    align-items: center;
    padding: 0 24px;
  }
  h3 {
    grid-column: 1 / 6;
  }
  .chart {
    grid-area: 1 / 6 / 11 / 13;
  }
  footer {
    justify-content: space-between;
    padding: 0 24px;
  }
  .label {
    grid-column: 1 / 4;
  }
  .short-label {
    grid-column: 1 / 2;
  }
  .long-label {
    grid-column: 1 / 5;
  }
  .value {
    grid-column: 5 / 6;
  }
  .long-value {
    grid-column: 4 / 6;
  }
  .value,
  .long-value {
    font-family: 'Oswald';
  }
</style>

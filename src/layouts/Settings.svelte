<script>
  import Select from '../molecules/Select';
  import Button from '../atoms/Button';
  import RangeInput from '../molecules/RangeInput';
  import Toggle from '../atoms/Toggle';
  import Switch from '../atoms/Switch';
  import {
    stateData,
    IVData,
    connectionType,
    storedEnergy,
    mode,
    storedCharge,
  } from '../stores';
  import { COMMANDS, CONSTRAINTS } from '../constants';
  import { getPowerFromFlow } from '../utils/others';
  import { ipcRenderer } from 'electron';
  import { __ } from '../utils/translations';

  const connectionTypeOptions = [
    { label: 'series', value: 0 },
    { label: 'parallel', value: 1 },
  ];

  const chargingOptions = [
    { label: 'constant current', value: 1 },
    { label: 'constant voltage', value: 2 },
  ];

  const dischargingOptions = [
    { label: 'external load', value: 0 },
    { label: 'constant current', value: 1 },
    { label: 'constant voltage', value: 2 },
  ];

  const initialState = $stateData;

  let loadMode = $stateData.loadMode,
    load = $IVData.setLoad,
    pumpPower = Math.max($stateData.pumpPower, 4);

  function setConnectionType(type) {
    connectionType.set(+type);
  }

  function togglePump(e) {
    if (e.target.checked) {
      ipcRenderer.send('serialCommand', COMMANDS.setPumpPower(pumpPower));
    } else {
      ipcRenderer.send('serialCommand', COMMANDS.setPumpPower(0));
    }
  }

  function toggleLight(e) {
    if (e.target.checked) {
      ipcRenderer.send('serialCommand', COMMANDS.turnOnLighting);
    } else {
      ipcRenderer.send('serialCommand', COMMANDS.turnOffLighting);
    }
  }
  function setPumpPower(flow) {
    pumpPower = getPowerFromFlow(+flow);
    if ($stateData.pumpPower > 0)
      ipcRenderer.send('serialCommand', COMMANDS.setPumpPower(pumpPower));
  }
  function toggleMode(e) {
    mode.set(Number(e.target.checked));
    ipcRenderer.send('serialCommand', COMMANDS.setMode($mode));
    setLoad(0);
  }

  function setLoadMode(m) {
    loadMode = +m;
    ipcRenderer.send('serialCommand', COMMANDS.setLoadMode(+m));
  }

  function setLoad(v) {
    load = v;
    ipcRenderer.send('serialCommand', COMMANDS.setLoad(v));
  }
</script>

<div class="layout">
  <header>{$__('parameter settings')}</header>
  <main>
    <div class="label right">{$__('connection type')}</div>
    <Select
      style="grid-column: 5 / 8"
      options={connectionTypeOptions}
      onChange={setConnectionType}
      defaultValue={$connectionType} />
    <div class="label right">{$__('pump')}</div>
    <Toggle
      style="grid-column: 5 / 6"
      on:change={togglePump}
      checked={initialState.pumpPower > 0} />
    <div class="label right">{$__('backlight')}</div>
    <Toggle
      style="grid-column: 5 / 6"
      on:change={toggleLight}
      checked={initialState.lightingOn} />
    <div class="dbc-label right">
      {$__('pump flow')}
      <br />
      {$__('ml/min', true)}
    </div>
    <RangeInput
      onChange={setPumpPower}
      range={CONSTRAINTS.pumpFlow}
      defaultValue={initialState.pumpPower}
      step={10}
      style="grid-area: 2 / 10 / 4 / 12" />
    <div class="long-label right">{$__('mode setting')}</div>
    <Switch
      style="grid-column: span 2"
      on:change={toggleMode}
      off="discharge"
      on="charge"
      checked={$mode} />
    <div class="long-label right">{$__('mode characteristic')}</div>
    <Select
      defaultValue={loadMode}
      style="grid-column: span 5"
      options={$mode ? chargingOptions : dischargingOptions}
      onChange={setLoadMode} />
    {#if loadMode}
      <div class="long-label right">
        {$__(loadMode === 1 ? 'current, A' : 'voltage, V', true)}
      </div>
      <RangeInput
        style="grid-column: span 5"
        step={0.1}
        onChange={setLoad}
        defaultValue={load}
        range={CONSTRAINTS[(loadMode === 1 ? 'current' : 'voltage') + ($connectionType === 1 ? 'Parallel' : 'Series')]} />
    {:else}
      <div class="spacer" />
    {/if}
    <div class="labeled-value" style="grid-column: 2 / 8">
      <span class="label">{$__('charge, mA*h')}</span>
      <strong class="value">{$storedCharge | 0}</strong>
    </div>
    <div class="labeled-value" style="grid-column: 8 / 12">
      <span class="label">{$__('voltage, V')}</span>
      <strong class="value">{$IVData.voltage}</strong>
    </div>
    <div class="labeled-value" style="grid-column: 2 / 8">
      <span class="label">{$__('energy, mW*h')}</span>
      <strong class="value">{$storedEnergy | 0}</strong>
    </div>
    <div class="labeled-value" style="grid-column: 8 / 12">
      <span class="label">{$__('current, A')}</span>
      <strong class="value">{$IVData.current}</strong>
    </div>
  </main>
  <footer>
    <Button on:click={() => window.scrollTo({ top: window.innerHeight })}>
      {$__('charts')}
    </Button>
  </footer>
</div>


<style>
  main {
    display: grid;
    grid-template-columns: repeat(12, 1fr);
    grid-column-gap: 24px;
    padding: 24px;
    align-items: center;
    grid-template-rows: repeat(8, 1fr);
  }
  .label {
    grid-column: 1 / 5;
  }
  .right {
    font-size: 2rem;
    text-align: right;
    justify-self: end;
  }
  .long-label {
    grid-column: 1 / 6;
  }
  .dbc-label {
    grid-area: 2 / 7 / 4 / 10;
    line-height: 1.5;
  }
  .labeled-value {
    font-size: 2rem;
    display: flex;
    justify-content: space-between;
  }
  .spacer {
    grid-column: span 12;
  }
  footer {
    justify-content: center;
  }
</style>

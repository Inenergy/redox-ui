<script>
  import { __ } from '../utils/translations';
  export let on;
  export let off;
  export let name;
  export let style;
  let checked;
</script>

<label {style}>
  {$__(off, true)}
  <input class="hidden" type="checkbox" {name} bind:checked on:change />
  <span class="track" class:checked>
    <span class="thumb" />
  </span>
  {$__(on, true)}
</label>

<style>
  label {
    white-space: nowrap;
    display: block;
  }
  .track {
    border-radius: 2px;
    padding: 2px;
    position: relative;
    width: 4rem;
    height: 2rem;
    background-color: var(--corporate-grey);
    display: inline-block;
    vertical-align: middle;
  }
  .track.checked {
    background-color: var(--corporate-orange);
  }

  .thumb {
    display: block;
    background-color: var(--bg-color);
    width: 1.6rem;
    height: 100%;
    border-radius: 2px;
    transition: 0.2s ease;
  }

  .track.checked > .thumb {
    transform: translateX(calc(100% + 4px));
  }
</style>

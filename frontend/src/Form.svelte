<script>
  import {
    createEventDispatcher,
    onMount
  } from "svelte";

  const dispatch = createEventDispatcher();

  let heights = [];
  let obstacles = [];
  let efforts = [];
  let minHeight, maxHeight, minObstacles, maxObstacles, minEfforts, maxEfforts;

  let submitBtn;

  onMount(async () => {
    const res = await (await fetch('https://api.skizzen.malte-thienel.de/fields')).json();

    heights = res.heights;
    obstacles = res.numberOfObstacles;
    efforts = res.numberOfEfforts;
  })

  async function onSubmit(event) {
    submitBtn.classList.add('is-loading');
    event.preventDefault();
    minHeight = setNullIfEmpty(minHeight);
    maxHeight = setNullIfEmpty(maxHeight);
    minObstacles = setNullIfEmpty(minObstacles);
    maxObstacles = setNullIfEmpty(maxObstacles);
    minEfforts = setNullIfEmpty(minEfforts);
    maxEfforts = setNullIfEmpty(maxEfforts);

    const urlParams = new URLSearchParams();

    addToParams(urlParams, "minHeight", minHeight);
    addToParams(urlParams, "maxHeight", maxHeight);
    addToParams(urlParams, "minObstacles", minObstacles);
    addToParams(urlParams, "maxObstacles", maxObstacles);
    addToParams(urlParams, "minEfforts", minEfforts);
    addToParams(urlParams, "maxEfforts", maxEfforts);

    const res = await fetch(`https://api.skizzen.malte-thienel.de/skizze?${urlParams.toString()}`);
    const parcours = await res.json();
    submitBtn.classList.remove('is-loading');

    dispatch('searchParcours', parcours);
  }

  function setNullIfEmpty(value) {
    return value === "--" ? null : value;
  }

  function addToParams(params, key, value) {
    if (value !== null && value !== undefined) {
      params.append(key, value);
    }
  }
</script>
<style>
  form {
    margin: 1rem;
  }

  .row {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 2rem;
  }

  .btn-row {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
  }

  .btn-row button {
    grid-column-start: 2;
  }

  .field:first-child {
    text-align: end;
  }
</style>
<form on:submit={onSubmit}>
  <div class="row">
    <div class="field">
      <label class="label" for="minHeight">Min. Höhe</label>
      <div class="control">
        <div class="select">
          <select id="minHeight" bind:value={minHeight}>
            <option>--</option>
            {#each heights as height}
              <option>{height}</option>
            {:else}
              <option>Wird geladen...</option>
            {/each}
          </select>
        </div>
      </div>
    </div>
    
    <div class="field">
      <label class="label" for="maxHeight">Max. Höhe</label>
      <div class="control">
        <div class="select">
          <select id="maxHeight" bind:value={maxHeight}>
            <option>--</option>
            {#each heights as height}
              <option>{height}</option>
            {:else}
              <option>Wird geladen...</option>
            {/each}
          </select>
        </div>
      </div>
    </div>
  </div>
  
  <div class="row">
    <div class="field">
      <label class="label" for="minObstacles">Min. Hindernisse</label>
      <div class="control">
        <div class="select">
          <select id="minObstacles" bind:value={minObstacles}>
            <option>--</option>
            {#each obstacles as obstacle}
              <option>{obstacle}</option>
            {:else}
              <option>Wird geladen...</option>
            {/each}
          </select>
        </div>
      </div>
    </div>
    
    <div class="field">
      <label class="label" for="maxObstacles">Max. Hindernisse</label>
      <div class="control">
        <div class="select">
          <select id="maxObstacles" bind:value={maxObstacles}>
            <option>--</option>
            {#each obstacles as obstacle}
              <option>{obstacle}</option>
            {:else}
              <option>Wird geladen...</option>
            {/each}
          </select>
        </div>
      </div>
    </div>
  </div>
  
  <div class="row">
    <div class="field">
      <label class="label" for="minEfforts">Min. Sprünge</label>
      <div class="control">
        <div class="select">
          <select id="minEfforts" bind:value={minEfforts}>
            <option>--</option>
            {#each efforts as effort}
              <option>{effort}</option>
            {:else}
              <option>Wird geladen...</option>
            {/each}
          </select>
        </div>
      </div>
    </div>
    
    <div class="field">
      <label class="label" for="maxEfforts">Max. Sprünge</label>
      <div class="control">
        <div class="select">
          <select id="maxEfforts" bind:value={maxEfforts}>
            <option>--</option>
            {#each efforts as effort}
              <option>{effort}</option>
            {:else}
              <option>Wird geladen...</option>
            {/each}
          </select>
        </div>
      </div>
    </div>
  </div>
  
  <div class="btn-row">
    <button class="button" bind:this={submitBtn}>Zufällige Skizzen finden</button>
  </div>
</form>
<script>
  export let parcours = [];

  $: {
    console.log(parcours);
  }

  function convertDate(rawDate) {
    const date = new Date(parseInt(rawDate));
    return `${padDate(date.getDate())}.${padDate(date.getMonth() + 1)}.${date.getFullYear()} ${padDate(date.getHours())}:${padDate(date.getMinutes())}`;
  }

  function padDate(date) {
    return date.toString().padStart(2, '0');
  }

  function displayData(data, suffix) {
    if (data === null || data === undefined || data === -1) {
      return '--'
    }

    if (suffix) {
      return data + suffix;
    }

    return data;
  }
</script>
<style>
  .card {
    flex: 1 1 250px;
    margin: 5px;
  }

  .card-content {
    display: grid;
    grid-template-rows: auto 1fr auto auto;
    height: 100%;
  }

  .link {
    justify-self: center;
  }
</style>

<div class="is-flex is-flex-wrap-wrap is-align-items-stretch">
  {#each parcours as p}
    <div class="card">
      <div class="card-content">
        <div class="has-text-weight-semibold is-size-7">
          {p.tournamentName}{p.date ? ', ' + convertDate(p.date) : ''}
        </div>
        <div>
          {p.competitionName}
        </div>
        <div class="mt-4 is-flex is-justify-content-space-between is-flex-wrap-wrap">
          <div>
            <div class="is-uppercase is-size-7">Höhe:</div>
            <div>{displayData(p.height, 'm')}</div>
          </div>
          <div>
            <div class="is-uppercase is-size-7">Hindernisse:</div>
            <div>{displayData(p.numberOfObstacles)}</div>
          </div>
          <div>
            <div class="is-uppercase is-size-7">Sprünge:</div>
            <div>{displayData(p.numberOfEfforts)}</div>
          </div>
        </div>
        <div class="mt-6 link">
          <a href={p.link} target="_blank">Parcousskizze anschauen</a>
        </div>
      </div>
    </div>
  {:else}
    <div class="card">
      <div class="card-content">
        <p class="content has-text-centered">Keine Skizzen gefunden</p>
        <p class="content has-text-centered"> Vielleicht solltest du die Filter anpassen 👀</p>
      </div>
    </div>
  {/each}
</div>
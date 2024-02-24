<script lang="ts">
    import { onMount } from "svelte";
    import parsePowerDataCharts from "$lib/utils/parsePowerDataCharts";

    export let predictedConsumption: number[];
    export let data: Awaited<ReturnType<typeof parsePowerDataCharts>>;

    let chart: any; // svelte-apexcharts does not provide type annotations

    onMount(async () => {
        chart = (await import("svelte-apexcharts")).chart;
    });

    // TODO: provide correct data via props
    $: options =
        data && predictedConsumption
            ? {
                  chart: {
                      type: "line",
                      height: 700,
                      width: 1500,
                  },
                  series: [
                      {
                          name: "real data",
                          data: data.consumption.slice(0, -1),
                      },
                      {
                          name: "predicted data",
                          data: predictedConsumption.slice(0, -1),
                      },
                  ],
                  yaxis: {
                      labels: {
                          formatter: function (val: number) {
                              return val.toFixed(2);
                          },
                      },
                  },
                  xaxis: {
                      type: "datetime",
                      categories: data.formatedDates,
                  },
              }
            : {};
</script>

{#if chart}
    <div class="chartWrapper">
        <div use:chart={options} />
    </div>
{/if}

<style>
    .chartWrapper {
        max-width: calc(100vw - 40px);
        overflow: scroll;
    }
</style>

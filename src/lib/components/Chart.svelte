<script lang="ts">
    import { onMount } from "svelte";

    let chart: any;

    onMount(async () => {
        chart = (await import("svelte-apexcharts")).chart;
    });

    // TODO: provide correct data via props
    let options = {
        chart: {
            type: "bar",
        },
        series: [
            {
                name: "sales",
                data: [30, 40, 35, 50, 49, 60, 70, 91, 125],
            },
        ],
        xaxis: {
            categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999],
        },
    };
</script>

{#if chart}
    <div use:chart={options} />
{/if}

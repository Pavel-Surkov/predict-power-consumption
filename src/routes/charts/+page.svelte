<script lang="ts">
    import * as tf from "@tensorflow/tfjs";
    import { onMount } from "svelte";
    import normalizeTensor from "$lib/utils/normalizeTensor";
    import parsePowerDataCharts from "$lib/utils/parsePowerDataCharts";
    import Chart from "$lib/components/Chart.svelte";

    let predictedConsumption: number[] = [];
    let data: Awaited<ReturnType<typeof parsePowerDataCharts>>;

    onMount(async () => {
        data = await parsePowerDataCharts();

        if (!data) {
            throw new Error("Failed to parse power consumption data");
        }

        const trainedModel = (await tf.loadLayersModel(
            `localstorage://${import.meta.env.VITE_LOCALSTORAGE_NAME}`,
        )) as tf.Sequential;

        if (trainedModel) {
            console.log("Model loaded from localStorage");
        }

        // Predict power consumption for whole year
        const normalizedInput = normalizeTensor(tf.tensor2d(data.inputTensor));

        const output = trainedModel.predict(normalizedInput) as any;
        predictedConsumption = Array.from(output.dataSync());
    });
</script>

<div class="pageWrapper">
    <h1>Charts page</h1>
    <Chart {data} {predictedConsumption} />
</div>

<style>
    .pageWrapper {
        display: flex;
        gap: 24px;
        flex-direction: column;
        align-items: center;
    }
</style>

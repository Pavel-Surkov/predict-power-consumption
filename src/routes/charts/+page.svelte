<script lang="ts">
    import * as tf from "@tensorflow/tfjs";
    import { onMount } from "svelte";
    import normalizeTensor from "$lib/utils/normalizeTensor";
    import parsePowerDataCharts from "$lib/utils/parsePowerDataCharts";
    import Chart from "$lib/components/Chart.svelte";

    let factConsumption: number[] = [];
    let predictedConsumtion: number[] = [];

    onMount(async () => {
        const data = await parsePowerDataCharts();

        if (!data) {
            throw new Error("Failed to parse power consumption data");
        }

        factConsumption = data.consumption;

        const trainedModel = (await tf.loadLayersModel(
            `localstorage://${import.meta.env.VITE_LOCALSTORAGE_NAME}`,
        )) as tf.Sequential;

        if (trainedModel) {
            console.log("Model loaded from localStorage");
        }

        // Predict power consumption for whole year
        const normalizedInput = normalizeTensor(tf.tensor2d(data.inputTensor));

        const output = trainedModel.predict(normalizedInput) as any;
        output.print();
        predictedConsumtion = Array.from(output.dataSync());
    });

    $: console.log(factConsumption, predictedConsumtion);
</script>

<h1>Charts page</h1>
<Chart />

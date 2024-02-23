<!-- Theory (IMPORTANT): https://www.youtube.com/watch?v=2ukv4AFF1wQ -->
<!-- Practise (IMPORTANT): https://www.youtube.com/watch?v=mSVfhb1wFqk -->
<script lang="ts">
    import * as tf from "@tensorflow/tfjs";
    import parsePowerData from "../utils/parsePowerData";
    import trainModel from "../utils/trainModel";
    import { onMount, onDestroy } from "svelte";
    import { DateInput } from "date-picker-svelte";
    import normalizeTensor from "../utils/normalizeTensor";

    const LOAD_TRAINED_MODEL = true;
    let loading = true;
    const epochs = 10;

    let excelData: Awaited<ReturnType<typeof parsePowerData>> | null;
    let INPUT_TENSOR: tf.Tensor2D;
    let model: tf.Sequential;
    let prediction = "0";

    let selectedDate = new Date("2021-01-01T00:00:00");

    // Only these values because input file contains hourly power consumption for 2021 year
    // Year is always 2021 and minutes and seconds are always 00
    $: selectedDateSplitted = {
        month: selectedDate.getMonth() + 1,
        day: selectedDate.getDate(),
        hour: selectedDate.getHours(),
    };

    onMount(async () => {
        excelData = await parsePowerData();

        if (!excelData) throw new Error("No excel data");

        INPUT_TENSOR = tf.tensor2d(excelData.inputTensor);
        const OUTPUT_TENSOR = tf.tensor1d(excelData.outputTensor);

        if (LOAD_TRAINED_MODEL) {
            const trainedModel = (await tf.loadLayersModel(
                `localstorage://${import.meta.env.VITE_LOCALSTORAGE_NAME}`,
            )) as tf.Sequential;

            if (trainedModel) {
                console.log("Model loaded from localStorage");
                model = trainedModel;
                loading = false;
                return;
            }
        }

        // Define a model
        model = tf.sequential();
        model.add(tf.layers.dense({ inputShape: [3], units: 1 }));

        await trainModel(model, INPUT_TENSOR, OUTPUT_TENSOR, epochs);

        loading = false;
    });

    onDestroy(() => {
        if (INPUT_TENSOR) {
            INPUT_TENSOR.dispose();
        }
        if (model) {
            model.dispose();
        }
    });

    function predict() {
        const input = tf.tensor2d([
            [
                selectedDateSplitted.month,
                selectedDateSplitted.day,
                selectedDateSplitted.hour,
            ],
        ]);

        const normalizedInput = normalizeTensor(input, INPUT_TENSOR);

        const output = model.predict(normalizedInput) as any;
        output.print();
        prediction = Number(Array.from(output.dataSync())[0]).toFixed(3);
    }
</script>

{#if excelData && !loading}
    <div class="wrapper">
        <h1 class="title">TensorFlow <span>model</span> example</h1>
        <h3>Predicted value: {prediction}</h3>
        <div class="formWrapper">
            <DateInput
                class="datePicker"
                format="dd/MM/yyyy, HH hrs"
                bind:value={selectedDate}
            />
        </div>
        <button type="button" class="predictBtn" on:click={predict}
            >Predict</button
        >
    </div>
{:else}
    <div>
        <h3>
            Loading data from Numbers and training model ({epochs} epochs)...
        </h3>
    </div>
{/if}

<style>
    .title {
        color: #646cff;
    }
    .title > span {
        color: #ff3e00;
    }
    .wrapper {
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    .formWrapper {
        display: flex;
        justify-content: center;
        margin-bottom: 30px;
    }
    .predictBtn {
        color: #fff;
        font-size: 1.2rem;
        padding: 0.5em 1.5em;
        border-radius: 999px;
        text-align: center;
        background: #646cff;
    }
</style>

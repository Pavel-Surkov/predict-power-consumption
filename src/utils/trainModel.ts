import * as tf from "@tensorflow/tfjs";
import normalizeTensor from "./normalizeTensor";

export default async function train(
  model: tf.Sequential,
  inputTensor: tf.Tensor,
  outputTensor: tf.Tensor,
  epochs: number,
) {
  // Normalize input tensor
  const NORMALIZED_INPUT_TENSOR = normalizeTensor(inputTensor);
  NORMALIZED_INPUT_TENSOR.print();

  // Prepare the model for trainig: specify the loss and the optimizer (learning rate = 0.01)
  model.compile({
    loss: "meanSquaredError",
    optimizer: "sgd",
  });

  console.log("model started training!");
  const start = performance.now();

  await model.fit(NORMALIZED_INPUT_TENSOR, outputTensor, {
    epochs,
    batchSize: 64,
    // shuffle: true,
  });

  const end = performance.now();
  console.log(`Model trained in ${((end - start) / 1000).toFixed(3)} s`);

  // Save the modal to localStorage
  await model.save(`localstorage://${import.meta.env.VITE_LOCALSTORAGE_NAME}`);
  console.log("Model saved in localStorage");

  // Remove inputTensor and outputTensor from memory
  outputTensor.dispose();
  NORMALIZED_INPUT_TENSOR.dispose();
}

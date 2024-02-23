import * as tf from "@tensorflow/tfjs";

export default function normalizeTensor(
  tensor: tf.Tensor,
  valuesTensor?: tf.Tensor,
) {
  return tf.tidy(() => {
    const MIN_TENSOR_VALUE = tf.min(valuesTensor ?? tensor, 0);
    const MAX_TENSOR_VALUE = tf.max(valuesTensor ?? tensor, 0);

    // Get substract tensor and range size
    const SUBSTRACT_TENSOR = tf.sub(tensor, MIN_TENSOR_VALUE);
    const RANGE_SIZE = tf.sub(MAX_TENSOR_VALUE, MIN_TENSOR_VALUE);

    // Tensor normalization
    const NORMALIZED_TENSOR = tf.div(SUBSTRACT_TENSOR, RANGE_SIZE);
    return NORMALIZED_TENSOR;
  });
}

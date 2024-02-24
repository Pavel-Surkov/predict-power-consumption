import datab64 from "$lib/shared/data_nov_dec.numbers?b64";
import z from "zod";
import parseExcelData from "./parseExcelData";

const tableRowSchema = z.object({
  Time: z.string(),
  Consumption: z.number(),
});

export const excelDataSchema = z.array(tableRowSchema);

type ConvertedTensors = {
  inputTensor: number[][];
  outputTensor: number[];
};

async function convertDataToTensors(data: z.infer<typeof excelDataSchema>) {
  return data.reduce(
    (acc: ConvertedTensors, row) => {
      const [datePart, timePart] = row.Time.split(" ");
      const [day, month] = datePart.split(".");

      // Do not count minutes & seconds because it's always equal to 00
      const [hours] = timePart.split(":");

      return {
        inputTensor: [...acc.inputTensor, [+month, +day, +hours]],
        outputTensor: [...acc.outputTensor, row.Consumption],
      };
    },
    { inputTensor: [], outputTensor: [] },
  );
}

export default async function parsePowerData() {
  const data = await parseExcelData(datab64, excelDataSchema).catch(
    console.error,
  );

  if (!data) throw new Error("Cannot parse excel data");

  return convertDataToTensors(data);
}

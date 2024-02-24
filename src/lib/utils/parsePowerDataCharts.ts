import datab64 from "$lib/shared/data_nov_dec.numbers?b64";
import z from "zod";
import parseExcelData from "./parseExcelData";
import { excelDataSchema } from "./parsePowerData";

type ConvertedTensors = {
  formatedDates: number[];
  consumption: number[];
  inputTensor: number[][];
};

async function convertDataToTensors(data: z.infer<typeof excelDataSchema>) {
  return data.reduce(
    (acc: ConvertedTensors, row) => {
      const [datePart, timePart] = row.Time.split(" ");
      const [day, month, year] = datePart.split(".");

      // Do not count minutes & seconds because it's always equal to 00
      const [hours, minutes, seconds] = timePart.split(":");

      return {
        formatedDates: [
          ...acc.formatedDates,
          new Date(
            `20${year}-${month}-${day}T${hours}:${minutes}:${seconds}`,
          ).getTime(),
        ],
        consumption: [...acc.consumption, row.Consumption],
        inputTensor: [...acc.inputTensor, [+month, +day, +hours]],
      };
    },
    { formatedDates: [], consumption: [], inputTensor: [] },
  );
}

export default async function parsePowerDataCharts() {
  const data = await parseExcelData(datab64, excelDataSchema).catch(
    console.error,
  );

  if (!data) throw new Error("Cannot parse excel data");

  return convertDataToTensors(data);
}

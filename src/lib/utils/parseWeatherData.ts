import weatherb64 from "$lib/shared/nsk-weather-2021.numbers?b64";
import z from "zod";
import parseExcelData from "./parseExcelData";

const weatherRowSchema = z.object({
  datetime: z.string().datetime(),
  temp: z.number(),
  cloudcover: z.number(),
  sunrise: z.string().datetime(),
  sunset: z.string().datetime(),
  conditions: z.string(),
});

const weatherDataSchema = z.array(weatherRowSchema);

function convertWeatherToTensor(data: z.infer<typeof weatherDataSchema>) {
  // TODO: convert weather data to tensor2d
  return data.map((row) => row);
}

// Use later, after building model
export default async function parseWeatherData() {
  const data = await parseExcelData(weatherb64, weatherDataSchema).catch(
    console.error,
  );

  if (!data) throw new Error("Cannot parse excel data");

  return convertWeatherToTensor(data);
}

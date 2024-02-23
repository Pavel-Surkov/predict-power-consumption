import z, { ZodType, type ZodTypeDef } from "zod";
import { read, utils } from "xlsx";

// Function parses 1st sheet of excel imported as b64
export default async function parseExcelData<T>(
  data: any,
  schema: ZodType<T, ZodTypeDef>,
) {
  let excelData: z.infer<typeof schema> | null;

  try {
    const workbook = read(data, { type: "base64" });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    excelData = schema.parse(utils.sheet_to_json(sheet));
  } catch (err) {
    console.error(err);
    excelData = null;
  }

  console.log(excelData);

  return excelData;
}

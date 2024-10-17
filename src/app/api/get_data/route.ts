import { fileURLToPath } from "url";
import path from "path";
import { spawn } from "child_process";
import fs from "fs"; // 导入 fs 模块
import Excel from "exceljs"; // 导入 ExcelJS 以读取 Excel 文件
import { DateTime } from "luxon"; // 导入 Luxon 以便处理日期

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
console.log(__dirname);

export async function GET() {
  const excelFilePath = path.join(
    __dirname,
    "../../python_files",
    "output.xlsx"
  );

  // 检查 Excel 文件是否存在
  if (!fs.existsSync(excelFilePath)) {
    // Excel 文件不存在，调用 Python 脚本生成新的 Excel 文件
    await runPythonScript();
  }

  try {
    // 读取 Excel 文件
    const workbook = new Excel.Workbook();
    await workbook.xlsx.readFile(excelFilePath);
    const worksheet = workbook.worksheets[0];

    // 假设时间戳在 C1，message 和 value 列分别在 A 和 B 列
    const timestampCell = worksheet.getCell(`C1`).text; // 假设 C1 是时间戳所在的单元格
    const previousTimestamp = DateTime.fromISO(timestampCell); // 解析时间戳

    const now = DateTime.now();
    const diffInMonths = now.diff(previousTimestamp, "months").months;

    // 检查时间差
    if (diffInMonths >= 1) {
      // 超过一个月，调用 Python 脚本重新生成 Excel 文件
      await runPythonScript();
    }

    // 提取 message 和 value 列的数据
    const messageArr: string[] = [];
    const valueArr: number[] = [];

    for (let i = 2; i <= worksheet.rowCount; i++) {
      // 从第2行开始
      const message = worksheet.getCell(`A${i}`).text; // 假设 A 列是 message
      const value = worksheet.getCell(`B${i}`).value; // 假设 B 列是 value

      if (message) {
        messageArr.push(message);
      }
      if (value) {
        valueArr.push(value as number); // 确保 value 是数字
      }
    }

    // 返回提取的 message 和 value 数据
    return new Response(
      JSON.stringify({ message: messageArr, value: valueArr }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "发生未知错误";
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}

async function runPythonScript() {
  const filePath = path.join(__dirname, "../../python_files", "test.py");
  const output = await new Promise<string>((resolve, reject) => {
    const pythonProcess = spawn("python", [filePath]);
    let output = "";

    pythonProcess.stdout.on("data", (data) => {
      output += data.toString();
    });

    pythonProcess.stderr.on("data", (data) => {
      console.error(`stderr: ${data}`);
      reject(data.toString());
    });

    pythonProcess.on("close", (code) => {
      if (code === 0) {
        resolve(output);
      } else {
        reject(new Error(`Python script failed with code ${code}`));
      }
    });
  });

  // 解析 Python 脚本输出为 JSON 对象
  let jsonData;
  try {
    jsonData = JSON.parse(output);
  } catch (parseError) {
    console.error("解析Python脚本输出时出错", parseError);
    throw new Error("解析Python脚本输出时出错");
  }

  // 返回解析后的 JSON 对象
  return new Response(JSON.stringify(jsonData), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

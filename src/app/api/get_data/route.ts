import { fileURLToPath } from "url";
import path from "path";
import { spawn } from "child_process";
import fs from "fs"; // 导入 fs 模块
import Excel from "exceljs"; // 导入 ExcelJS 以读取 Excel 文件
import { DateTime } from "luxon"; // 导入 Luxon 以便处理日期

// 定义 __filename 和 __dirname 变量，分别表示当前文件的绝对路径和目录
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// console.log(__filename, __dirname);

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
    const worksheet = workbook.worksheets[0]; // 读取 Excel 文件并获取第一个工作表

    // 获取 "timestamp" 列的第一个单元格，假设它是时间戳
    const timestampCell = worksheet.getCell(2, 4).text;
    // 稍后确保用这个格式解析时间戳
    const timestampFormat = "yyyy-MM-dd"; // 指定格式

    // 使用指定格式解析时间戳
    const previousTimestamp = DateTime.fromFormat(
      timestampCell,
      timestampFormat
    );

    // 检查解析结果
    if (!previousTimestamp.isValid) {
      throw new Error(`无效的时间戳：${timestampCell}`);
    }

    const now = DateTime.now();
    const diffInDays = now.diff(previousTimestamp, "days").days; // 计算时间差

    // 检查时间差
    if (diffInDays >= 30) {
      // 超过30天，调用 Python 脚本重新生成 Excel 文件
      await runPythonScript();
    }

    // 提取 date，cosine_similarity 和 Important_Event 列的数据
    const xAxisData = [],
      yAxisData = [],
      specialPoints = [];

    for (let i = 2; i <= worksheet.rowCount; i++) {
      const row = worksheet.getRow(i);
      if (!row.hasValues) continue; // 如果当前行没有数据，则跳过

      const date = row.getCell(1).value; // 第一列是日期
      const cosineSimilarity = row.getCell(2).value; // 第二列是相似度
      const importantEvent = row.getCell(3).value; // 第三列是重要事件

      xAxisData.push(date);
      yAxisData.push(cosineSimilarity);
      if (importantEvent) {
        specialPoints.push({
          dataIndex: i - 2,
          name: importantEvent,
          value: cosineSimilarity,
        });
        // console.log(i - 1, date, cosineSimilarity, importantEvent);
      }
    }

    // 返回提取的 xAxisData、yAxisData 和 specialPoints 数据

    return new Response(
      JSON.stringify({ x: xAxisData, y: yAxisData, points: specialPoints }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("错误信息:", error);

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

import { exec } from "child_process";
import path from "path";
import { NextResponse } from "next/server";

export async function GET() {
  // 获取 Python 脚本的绝对路径
  const pythonScriptPath = path.join(process.cwd(), "python_files", "test.py");

  // 执行 Python 脚本
  return new Promise((resolve, reject) => {
    exec(`python3 ${pythonScriptPath}`, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing Python script: ${error}`);
        resolve(
          NextResponse.json(
            { error: "Error executing Python script" },
            { status: 500 }
          )
        );
        return;
      }

      if (stderr) {
        console.error(`Python stderr: ${stderr}`);
        resolve(NextResponse.json({ error: stderr }, { status: 500 }));
        return;
      }

      // 解析 Python 输出，并将其作为响应返回
      try {
        const data = JSON.parse(stdout);
        resolve(NextResponse.json(data));
      } catch (e) {
        console.error(`Error parsing Python output: ${e}`);
        resolve(
          NextResponse.json(
            { error: "Error parsing Python output" },
            { status: 500 }
          )
        );
      }
    });
  });
}

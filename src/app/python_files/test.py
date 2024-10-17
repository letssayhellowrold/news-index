import os  # 导入 os 模块
import json
from datetime import datetime
import pandas as pd
import openpyxl

def main():
    # 这里执行你的逻辑
    data = {
        "message": ["2024-10-01", "2024-10-02", "2024-10-03", "2024-10-04", "2024-10-05"],
        "value": [100, 150, 120, 180, 200],
    }

    # 获取当前时间戳
    current_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    
    # 创建 DataFrame
    df = pd.DataFrame(data)

    # 添加时间戳作为一个单独的单元
    timestamp_df = pd.DataFrame({"timestamp": [current_time]})  # 单独的 DataFrame 只包含时间戳
    df = pd.concat([df, timestamp_df], axis=1)  # 将时间戳单独添加到原 DataFrame 中

    # 获取当前文件的路径
    current_dir = os.path.dirname(os.path.abspath(__file__))  # 获取当前脚本的目录

    # 保存为 Excel 文件到当前文件夹
    excel_file_path = os.path.join(current_dir, "output.xlsx")  # 指定Excel文件名
    df.to_excel(excel_file_path, index=False)  # 保存文件，不保存行索引

    # print(f"Excel 文件已生成，并保存为 {excel_file_path}")

if __name__ == "__main__":
    main()

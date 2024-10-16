# scripts/myscript.py
import json

def main():
    # 这里执行你的逻辑
    data = {"message": "Hello from Python", "value": 42}
    print(json.dumps(data))  # 输出 JSON 格式

if __name__ == "__main__":
    main()

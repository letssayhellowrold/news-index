export async function GET() {
  // 在这里处理你的数据请求，可能是从数据库或外部API获取数据
  const data = {
    // 一些示例数据
    message: "Hello from the get_data API!",
    // 其他数据...
  };

  return new Response(JSON.stringify(data), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

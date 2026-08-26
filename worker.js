export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // إنشاء الرابط
    if (url.pathname === "/api/create" && request.method === "POST") {
      try {
        const data = await request.json();

        if (!data.name || !data.message) {
          return new Response(
            JSON.stringify({
              error: "الاسم والرسالة مطلوبان"
            }),
            {
              status: 400,
              headers: {
                "Content-Type": "application/json"
              }
            }
          );
        }

        const messageData = {
          name: data.name,
          message: data.message
        };

        const encoded = encodeURIComponent(
          JSON.stringify(messageData)
        );

        return new Response(
          JSON.stringify({
            success: true,
            url: `${url.origin}/message?data=${encoded}`
          }),
          {
            status: 200,
            headers: {
              "Content-Type": "application/json"
            }
          }
        );

      } catch (error) {
        return new Response(
          JSON.stringify({
            error: "حدث خطأ أثناء إنشاء الرابط"
          }),
          {
            status: 500,
            headers: {
              "Content-Type": "application/json"
            }
          }
        );
      }
    }

    // فتح صفحة الرسالة
    if (url.pathname === "/message") {
      return env.ASSETS.fetch(
        new Request(
          new URL("/message.html", request.url),
          request
        )
      );
    }

    // باقي الموقع
    return env.ASSETS.fetch(request);
  }
};

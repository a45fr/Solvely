export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // =========================
    // إنشاء رابط الرسالة
    // =========================
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

        const payload = JSON.stringify({
          name: data.name,
          message: data.message
        });

        const id = encodeURIComponent(payload);

        return new Response(
          JSON.stringify({
            success: true,
            url: `${url.origin}/message/${id}`
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
            error: "تعذر إنشاء الرابط"
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


    // =========================
    // فتح الرسالة
    // =========================
    if (url.pathname.startsWith("/api/message/")) {
      try {
        const id = url.pathname.substring(
          "/api/message/".length
        );

        const data = JSON.parse(
          decodeURIComponent(id)
        );

        return new Response(
          JSON.stringify(data),
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
            error: "الرابط غير صحيح ❌"
          }),
          {
            status: 404,
            headers: {
              "Content-Type": "application/json"
            }
          }
        );
      }
    }


    // =========================
    // صفحة الرسالة
    // =========================
    if (url.pathname.startsWith("/message/")) {
      return env.ASSETS.fetch(
        new Request(
          new URL("/message.html", request.url),
          request
        )
      );
    }


    // =========================
    // باقي ملفات الموقع
    // =========================
    return env.ASSETS.fetch(request);
  }
};

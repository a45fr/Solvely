export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // إنشاء رابط رسالة
    if (url.pathname === "/api/create" && request.method === "POST") {
      try {
        const body = await request.text();

        if (!body) {
          return new Response(
            JSON.stringify({ error: "لم تصل بيانات الرسالة" }),
            {
              status: 400,
              headers: { "Content-Type": "application/json" }
            }
          );
        }

        const data = JSON.parse(body);

        if (!data.name || !data.message) {
          return new Response(
            JSON.stringify({ error: "الاسم والرسالة مطلوبان" }),
            {
              status: 400,
              headers: { "Content-Type": "application/json" }
            }
          );
        }

        const payload = JSON.stringify({
          name: data.name,
          message: data.message
        });

        const encoded = btoa(
          unescape(encodeURIComponent(payload))
        )
          .replace(/\+/g, "-")
          .replace(/\//g, "_")
          .replace(/=+$/, "");

        return new Response(
          JSON.stringify({
            success: true,
            url: `${url.origin}/message/${encoded}`
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
            error: "خطأ في إنشاء الرابط",
            details: error.message
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

    // قراءة الرسالة
    if (url.pathname.startsWith("/api/message/")) {
      try {
        const id = url.pathname.split("/").pop();

        const base64 = id
          .replace(/-/g, "+")
          .replace(/_/g, "/")
          .padEnd(id.length + (4 - id.length % 4) % 4, "=");

        const json = decodeURIComponent(
          escape(atob(base64))
        );

        const data = JSON.parse(json);

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

    // صفحة الرسالة
    if (url.pathname.startsWith("/message/")) {
      return env.ASSETS.fetch(
        new Request(
          new URL("/message.html", request.url),
          request
        )
      );
    }

    // باقي ملفات الموقع
    return env.ASSETS.fetch(request);
  }
};

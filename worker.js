export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // إنشاء رسالة جديدة
    if (url.pathname === "/api/message" && request.method === "POST") {
      try {
        const data = await request.json();

        if (!data.name || !data.message) {
          return Response.json(
            { error: "الاسم والرسالة مطلوبان" },
            { status: 400 }
          );
        }

        const id = btoa(
          unescape(
            encodeURIComponent(
              JSON.stringify({
                name: data.name,
                message: data.message
              })
            )
          )
        )
          .replace(/\+/g, "-")
          .replace(/\//g, "_")
          .replace(/=/g, "");

        return Response.json({
          success: true,
          id
        });

      } catch {
        return Response.json(
          { error: "بيانات غير صحيحة" },
          { status: 400 }
        );
      }
    }

    // فتح رسالة
    if (url.pathname.startsWith("/api/message/")) {
      try {
        const id = url.pathname.split("/").pop();

        const json = decodeURIComponent(
          escape(
            atob(
              id
                .replace(/-/g, "+")
                .replace(/_/g, "/")
                .padEnd(id.length + (4 - id.length % 4) % 4, "=")
            )
          )
        );

        const data = JSON.parse(json);

        return Response.json(data);

      } catch {
        return Response.json(
          { error: "الرابط غير صحيح أو تالف ❌" },
          { status: 404 }
        );
      }
    }

    // ملفات الموقع
    return env.ASSETS.fetch(request);
  }
};

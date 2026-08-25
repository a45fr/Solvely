export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // إنشاء رسالة
    if (url.pathname === "/api/create" && request.method === "POST") {
      try {
        const data = await request.json();

        if (!data.name || !data.message) {
          return Response.json(
            { error: "الاسم والرسالة مطلوبان" },
            { status: 400 }
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

        return Response.json({
          success: true,
          url: `${url.origin}/message/${encoded}`
        });

      } catch (error) {
        return Response.json(
          { error: "تعذر إنشاء الرابط" },
          { status: 400 }
        );
      }
    }

    // فتح الرسالة
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

        return Response.json(data);

      } catch {
        return Response.json(
          { error: "الرابط غير صحيح ❌" },
          { status: 404 }
        );
      }
    }

    // فتح صفحة الرسالة
    if (url.pathname.startsWith("/message/")) {
      return env.ASSETS.fetch(
        new Request(new URL("/message.html", request.url), request)
      );
    }

    return env.ASSETS.fetch(request);
  }
};

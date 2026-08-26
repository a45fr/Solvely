export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // ==============================
    // إنشاء رسالة
    // ==============================
    if (
      url.pathname === "/api/create" &&
      request.method === "POST"
    ) {
      try {
        const data = await request.json();

        const name = String(data.name || "").trim();
        const message = String(data.message || "").trim();

        if (!name) {
          return Response.json(
            { error: "اكتب اسم الشخص أولاً 💜" },
            { status: 400 }
          );
        }

        if (!message) {
          return Response.json(
            { error: "اكتب الرسالة أولاً 💌" },
            { status: 400 }
          );
        }

        if (name.length > 40) {
          return Response.json(
            { error: "الاسم طويل جدًا" },
            { status: 400 }
          );
        }

        if (message.length > 1000) {
          return Response.json(
            { error: "الرسالة طويلة جدًا" },
            { status: 400 }
          );
        }

        // ID قصير وعشوائي
        const id = crypto.randomUUID()
          .replaceAll("-", "")
          .slice(0, 8);

        await env.SOLVELY_MESSAGES.put(
          id,
          JSON.stringify({
            name,
            message,
            createdAt: new Date().toISOString()
          })
        );

        return Response.json({
          success: true,
          id,
          url: `${url.origin}/message/${id}`
        });

      } catch (error) {
        return Response.json(
          {
            error: "تعذر إنشاء الرابط"
          },
          { status: 500 }
        );
      }
    }


    // ==============================
    // جلب الرسالة
    // ==============================
    if (
      url.pathname.startsWith("/api/message/") &&
      request.method === "GET"
    ) {
      try {
        const id =
          url.pathname
            .split("/")
            .pop();

        if (!id) {
          return Response.json(
            { error: "الرابط غير صحيح" },
            { status: 400 }
          );
        }

        const saved =
          await env.SOLVELY_MESSAGES.get(id);

        if (!saved) {
          return Response.json(
            {
              error:
                "هذه الرسالة غير موجودة أو انتهت ❌"
            },
            { status: 404 }
          );
        }

        return Response.json(
          JSON.parse(saved)
        );

      } catch (error) {
        return Response.json(
          {
            error:
              "حدث خطأ أثناء فتح الرسالة"
          },
          { status: 500 }
        );
      }
    }


    // ==============================
    // صفحة الرسالة
    // ==============================
    if (
      url.pathname.startsWith("/message/")
    ) {
      return env.ASSETS.fetch(
        new Request(
          new URL(
            "/message.html",
            request.url
          ),
          request
        )
      );
    }


    // ==============================
    // ملفات الموقع
    // ==============================
    return env.ASSETS.fetch(request);
  }
};

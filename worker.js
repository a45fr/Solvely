export default {
  async fetch(request, env) {

    const url = new URL(request.url);
    const path = url.pathname;


    // =====================================
    // إنشاء رسالة جديدة
    // =====================================

    if (
      path === "/api/create" &&
      request.method === "POST"
    ) {

      try {

        const body = await request.json();

        const name =
          String(body.name || "").trim();

        const message =
          String(body.message || "").trim();


        // التحقق من الاسم

        if (!name) {

          return Response.json(
            {
              error: "اسم الشخص مطلوب"
            },
            {
              status: 400
            }
          );

        }


        // التحقق من الرسالة

        if (!message) {

          return Response.json(
            {
              error: "الرسالة مطلوبة"
            },
            {
              status: 400
            }
          );

        }


        // الحد الأقصى للرسالة

        if (message.length > 500) {

          return Response.json(
            {
              error: "الرسالة طويلة جدًا"
            },
            {
              status: 400
            }
          );

        }


        // إنشاء ID

        const id =
          crypto.randomUUID()
            .replaceAll("-", "")
            .slice(0, 12);


        // تخزين الرسالة في KV

        await env.KV.put(
          `message:${id}`,
          JSON.stringify({
            name: name,
            message: message,
            createdAt: Date.now()
          })
        );


        // إنشاء الرابط

        const messageUrl =
          `${url.origin}/message/${id}`;


        return Response.json({
          success: true,
          url: messageUrl,
          id: id
        });


      } catch (error) {

        console.error(error);

        return Response.json(
          {
            error: "تعذر إنشاء الرسالة"
          },
          {
            status: 500
          }
        );

      }

    }



    // =====================================
    // جلب الرسالة
    // =====================================

    if (
      path.startsWith("/api/message/") &&
      request.method === "GET"
    ) {

      try {

        const id =
          decodeURIComponent(
            path.replace(
              "/api/message/",
              ""
            )
          );


        if (!id) {

          return Response.json(
            {
              error: "الرابط غير صحيح"
            },
            {
              status: 400
            }
          );

        }


        // جلب الرسالة من KV

        const stored =
          await env.KV.get(
            `message:${id}`
          );


        if (!stored) {

          return Response.json(
            {
              error:
                "الرسالة غير موجودة أو انتهت"
            },
            {
              status: 404
            }
          );

        }


        const data =
          JSON.parse(stored);


        return Response.json({
          name: data.name,
          message: data.message
        });


      } catch (error) {

        console.error(error);

        return Response.json(
          {
            error: "تعذر فتح الرسالة"
          },
          {
            status: 500
          }
        );

      }

    }



    // =====================================
    // صفحة الرسالة
    // =====================================
    //
    // مهم جدًا:
    //
    // لا نطلب /message.html
    // لأن Cloudflare يحوله إلى /message
    // ويضيع ID الموجود بالرابط.
    //
    // نطلب /message داخليًا،
    // لكن رابط المستخدم يبقى:
    //
    // /message/XXXXXXXX
    //
    // =====================================

    if (
      path.startsWith("/message/")
    ) {

      const assetRequest =
        new Request(
          `${url.origin}/message`,
          request
        );


      return env.ASSETS.fetch(
        assetRequest
      );

    }



    // =====================================
    // باقي ملفات الموقع
    // =====================================

    return env.ASSETS.fetch(
      request
    );

  }
};

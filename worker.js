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

                const body =
                    await request.json();

                const name =
                    String(body.name || "").trim();

                const message =
                    String(body.message || "").trim();


                if (!name) {

                    return Response.json(
                        {
                            error:
                                "اسم الشخص مطلوب"
                        },
                        {
                            status: 400
                        }
                    );
                }


                if (!message) {

                    return Response.json(
                        {
                            error:
                                "الرسالة مطلوبة"
                        },
                        {
                            status: 400
                        }
                    );
                }


                if (message.length > 1000) {

                    return Response.json(
                        {
                            error:
                                "الرسالة طويلة جدًا"
                        },
                        {
                            status: 400
                        }
                    );
                }


                // إنشاء ID عشوائي

                const id =
                    crypto.randomUUID()
                        .replaceAll("-", "")
                        .slice(0, 12);


                // تخزين الرسالة

                await env.KV.put(
                    `message:${id}`,
                    JSON.stringify({
                        name,
                        message,
                        createdAt:
                            Date.now()
                    })
                );


                // الرابط

                const messageUrl =
                    `${url.origin}/message/${id}`;


                return Response.json({
                    success: true,
                    url: messageUrl,
                    id
                });

            } catch (error) {

                return Response.json(
                    {
                        error:
                            "تعذر إنشاء الرسالة"
                    },
                    {
                        status: 500
                    }
                );
            }
        }



        // =====================================
        // جلب رسالة
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
                            error:
                                "الرابط غير صحيح"
                        },
                        {
                            status: 400
                        }
                    );
                }


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

                return Response.json(
                    {
                        error:
                            "تعذر فتح الرسالة"
                    },
                    {
                        status: 500
                    }
                );
            }
        }



        // =====================================
        // صفحة الرسالة
        // /message/XXXXXXXX
        // =====================================

        if (
            path.startsWith("/message/")
        ) {

            return env.ASSETS.fetch(
                new Request(
                    `${url.origin}/message.html`,
                    request
                )
            );
        }



        // =====================================
        // باقي ملفات الموقع
        // =====================================

        return env.ASSETS.fetch(request);
    }
};

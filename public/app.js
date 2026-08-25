const nameInput =
    document.getElementById("name");

const messageInput =
    document.getElementById("message");

const count =
    document.getElementById("count");

const createBtn =
    document.getElementById("createBtn");

const result =
    document.getElementById("result");

const generatedLink =
    document.getElementById("generatedLink");

const copyBtn =
    document.getElementById("copyBtn");

const shareBtn =
    document.getElementById("shareBtn");


// ==============================
// عداد الأحرف
// ==============================

messageInput.addEventListener(
    "input",
    () => {

        count.textContent =
            `${messageInput.value.length} / 500`;

    }
);


// ==============================
// إنشاء الرابط
// ==============================

createBtn.addEventListener(
    "click",
    async () => {

        const name =
            nameInput.value.trim();

        const message =
            messageInput.value.trim();


        // التحقق من الاسم

        if (!name) {

            alert(
                "اكتب اسم الشخص أولاً 💜"
            );

            nameInput.focus();

            return;
        }


        // التحقق من الرسالة

        if (!message) {

            alert(
                "اكتب الرسالة أولاً 💌"
            );

            messageInput.focus();

            return;
        }


        // حالة التحميل

        createBtn.disabled = true;

        createBtn.innerHTML =
            "جاري إنشاء الرابط... ⏳";


        try {

            const response =
                await fetch(
                    "/api/create",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify({
                                name,
                                message
                            })
                    }
                );


            const data =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    data.error ||
                    "حدث خطأ أثناء إنشاء الرابط"
                );

            }


            // عرض الرابط

            generatedLink.value =
                data.url;


            result.classList.remove(
                "hidden"
            );


            // النزول للنتيجة

            result.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });


        } catch (error) {

            alert(
                error.message ||
                "تعذر إنشاء الرابط"
            );

        } finally {

            createBtn.disabled =
                false;

            createBtn.innerHTML =
                `
                <span>إنشاء الرابط</span>
                <span>✨</span>
                `;

        }

    }
);


// ==============================
// نسخ الرابط
// ==============================

copyBtn.addEventListener(
    "click",
    async () => {

        const url =
            generatedLink.value;


        if (!url) {
            return;
        }


        try {

            await navigator.clipboard
                .writeText(url);


            copyBtn.textContent =
                "تم ✓";


            setTimeout(
                () => {

                    copyBtn.textContent =
                        "نسخ";

                },
                2000
            );


        } catch (error) {

            generatedLink.select();

            document.execCommand(
                "copy"
            );

            copyBtn.textContent =
                "تم ✓";

        }

    }
);


// ==============================
// مشاركة الرابط
// ==============================

shareBtn.addEventListener(
    "click",
    async () => {

        const url =
            generatedLink.value;


        if (!url) {
            return;
        }


        // إذا الجهاز يدعم المشاركة

        if (
            navigator.share
        ) {

            try {

                await navigator.share({

                    title:
                        "رسالة من Solvely 💌",

                    text:
                        "وصلك رابط رسالة 💌",

                    url: url

                });

            } catch (error) {

                // المستخدم ممكن يلغي المشاركة
                console.log(
                    "Share cancelled"
                );

            }

            return;
        }


        // إذا المشاركة غير متوفرة

        try {

            await navigator.clipboard
                .writeText(url);

            alert(
                "تم نسخ الرابط ❤️"
            );

        } catch {

            generatedLink.select();

            document.execCommand(
                "copy"
            );

            alert(
                "تم نسخ الرابط ❤️"
            );

        }

    }
);

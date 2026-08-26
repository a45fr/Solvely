const nameInput = document.getElementById("name");
const messageInput = document.getElementById("message");
const count = document.getElementById("count");

const createBtn = document.getElementById("createBtn");

const result = document.getElementById("result");
const generatedLink = document.getElementById("generatedLink");

const copyBtn = document.getElementById("copyBtn");
const shareBtn = document.getElementById("shareBtn");


// =================================
// عداد الأحرف
// =================================

messageInput.addEventListener("input", () => {
    count.textContent =
        `${messageInput.value.length} / 1000`;
});


// =================================
// إنشاء الرابط
// =================================

createBtn.addEventListener("click", async () => {

    const name =
        nameInput.value.trim();

    const message =
        messageInput.value.trim();


    if (!name) {

        alert("اكتب اسم الشخص أولاً 💜");

        nameInput.focus();

        return;
    }


    if (!message) {

        alert("اكتب الرسالة أولاً 💌");

        messageInput.focus();

        return;
    }


    createBtn.disabled = true;

    createBtn.innerHTML = `
        <span>جاري إنشاء الرابط...</span>
        <span>⏳</span>
    `;


    try {

        const response = await fetch(
            "/api/create",
            {
                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body: JSON.stringify({
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
                "تعذر إنشاء الرابط"
            );
        }


        generatedLink.value =
            data.url;


        result.classList.remove(
            "hidden"
        );


        result.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });


    } catch (error) {

        alert(
            error.message ||
            "حدث خطأ أثناء إنشاء الرابط ❌"
        );

    } finally {

        createBtn.disabled = false;

        createBtn.innerHTML = `
            <span>إنشاء الرابط</span>
            <span class="button-arrow">←</span>
        `;
    }

});


// =================================
// نسخ الرابط
// =================================

copyBtn.addEventListener(
    "click",
    async () => {

        const url =
            generatedLink.value;

        if (!url) return;


        try {

            await navigator.clipboard
                .writeText(url);

            copyBtn.textContent =
                "تم ✓";


            setTimeout(() => {

                copyBtn.textContent =
                    "نسخ";

            }, 2000);


        } catch {

            generatedLink.select();

            document.execCommand(
                "copy"
            );

            copyBtn.textContent =
                "تم ✓";
        }

    }
);


// =================================
// مشاركة الرابط
// =================================

shareBtn.addEventListener(
    "click",
    async () => {

        const url =
            generatedLink.value;

        if (!url) return;


        if (
            navigator.share
        ) {

            try {

                await navigator.share({

                    title:
                        "رسالة من Solvely 💌",

                    text:
                        "وصلك شيء خاص 💌",

                    url

                });

            } catch {

                // المستخدم ألغى المشاركة
            }

            return;
        }


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

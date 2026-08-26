const nameElement = document.getElementById("name");
const messageElement = document.getElementById("message");

const shareButton = document.getElementById("shareButton");
const openScreen = document.getElementById("openScreen");
const messageCard = document.getElementById("messageCard");
const openButton = document.getElementById("openMessage");
const envelope = document.getElementById("envelope");


// =====================================
// الحصول على ID الرسالة من الرابط
// =====================================

function getMessageId() {

    const parts = window.location.pathname
        .split("/")
        .filter(Boolean);

    const messageIndex =
        parts.indexOf("message");

    if (
        messageIndex === -1 ||
        !parts[messageIndex + 1]
    ) {
        return null;
    }

    return parts[messageIndex + 1];
}


const messageId = getMessageId();


// =====================================
// تحميل الرسالة
// =====================================

async function loadMessage() {

    if (!messageId) {

        nameElement.textContent = "عذرًا";

        messageElement.textContent =
            "الرابط غير صحيح ❌";

        openScreen.style.display = "none";

        return;
    }


    try {

        const response = await fetch(
            `/api/message/${encodeURIComponent(messageId)}`,
            {
                method: "GET",
                headers: {
                    "Accept": "application/json"
                }
            }
        );


        const text = await response.text();


        let data;

        try {
            data = JSON.parse(text);
        } catch {

            throw new Error(
                "السيرفر رجّع استجابة غير صحيحة"
            );
        }


        if (!response.ok) {

            throw new Error(
                data.error ||
                "تعذر فتح الرسالة ❌"
            );
        }


        if (
            !data.name ||
            !data.message
        ) {

            throw new Error(
                "بيانات الرسالة ناقصة ❌"
            );
        }


        nameElement.textContent =
            data.name;

        messageElement.textContent =
            data.message;


    } catch (error) {

        console.error(
            "Message error:",
            error
        );

        nameElement.textContent =
            "عذرًا";

        messageElement.textContent =
            error.message ||
            "تعذر تحميل الرسالة ❌";

        openScreen.style.display =
            "none";
    }
}


// =====================================
// فتح الرسالة
// =====================================

openButton.addEventListener(
    "click",
    () => {

        envelope.style.transform =
            "scale(1.25) rotate(8deg)";

        openButton.disabled = true;

        openScreen.style.opacity = "0";

        openScreen.style.transform =
            "translateY(15px) scale(.96)";


        setTimeout(() => {

            openScreen.style.display =
                "none";

            messageCard.style.display =
                "block";

            messageCard.style.opacity =
                "0";

            messageCard.style.transform =
                "translateY(20px) scale(.96)";


            requestAnimationFrame(() => {

                messageCard.style.opacity =
                    "1";

                messageCard.style.transform =
                    "translateY(0) scale(1)";
            });

        }, 450);
    }
);


// =====================================
// إنشاء رسالة جديدة
// =====================================

shareButton.addEventListener(
    "click",
    () => {

        window.location.href = "/";
    }
);


// =====================================
// تشغيل
// =====================================

loadMessage();

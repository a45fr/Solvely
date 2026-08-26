const nameElement = document.getElementById("name");
const messageElement = document.getElementById("message");

const openScreen = document.getElementById("openScreen");
const openMessage = document.getElementById("openMessage");
const messageCard = document.getElementById("messageCard");

const shareButton = document.getElementById("shareButton");


// =====================================
// استخراج ID الرسالة
// =====================================

function getMessageId() {

    const parts =
        window.location.pathname
            .split("/")
            .filter(Boolean);

    const index =
        parts.indexOf("message");

    if (index !== -1 && parts[index + 1]) {
        return parts[index + 1];
    }

    return null;
}


// =====================================
// تحميل الرسالة
// =====================================

async function loadMessage() {

    const id = getMessageId();

    if (!id) {

        messageElement.textContent =
            "الرابط غير صحيح ❌";

        return;
    }

    try {

        const response = await fetch(
            `/api/message/${encodeURIComponent(id)}`
        );

        const data = await response.json();

        if (!response.ok) {

            throw new Error(
                data.error ||
                "تعذر فتح الرسالة ❌"
            );
        }

        // نخزن البيانات بدون إظهارها
        nameElement.textContent =
            data.name || "شخص";

        messageElement.textContent =
            data.message || "لا توجد رسالة";

    } catch (error) {

        console.error(error);

        nameElement.textContent =
            "عذرًا";

        messageElement.textContent =
            error.message ||
            "تعذر تحميل الرسالة ❌";
    }
}


// =====================================
// فتح الرسالة
// =====================================

if (openMessage) {

    openMessage.addEventListener(
        "click",
        () => {

            // إخفاء ظرف الرسالة
            openScreen.style.display =
                "none";

            // إظهار الرسالة
            messageCard.style.display =
                "block";

            // نزول بسيط للرسالة
            setTimeout(() => {

                messageCard.scrollIntoView({
                    behavior: "smooth",
                    block: "center"
                });

            }, 100);

        }
    );

}


// =====================================
// إرسال رسالة جديدة
// =====================================

if (shareButton) {

    shareButton.addEventListener(
        "click",
        () => {

            window.location.href = "/";
        }
    );

}


// =====================================
// تشغيل
// =====================================

loadMessage();

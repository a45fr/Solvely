const nameElement = document.getElementById("name");
const messageElement = document.getElementById("message");
const shareButton = document.getElementById("shareButton");

const messageCard =
    document.querySelector(".message-card");


// ==============================
// استخراج ID الرسالة
// ==============================

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


// ==============================
// تحميل الرسالة
// ==============================

async function loadMessage() {

    const messageId = getMessageId();

    if (!messageId) {
        messageElement.textContent =
            "الرابط غير صحيح ❌";
        return;
    }

    try {

        const response = await fetch(
            `/api/message/${encodeURIComponent(messageId)}`
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.error || "تعذر فتح الرسالة ❌"
            );
        }

        nameElement.textContent =
            data.name || "شخص ما";

        messageElement.textContent =
            data.message || "لا توجد رسالة";

    } catch (error) {

        console.error(error);

        nameElement.textContent = "عذرًا";

        messageElement.textContent =
            error.message ||
            "تعذر تحميل الرسالة ❌";
    }
}


// ==============================
// الضغط على خانة الرسالة
// ==============================

if (messageCard) {

    messageCard.addEventListener(
        "click",
        () => {

            messageCard.classList.toggle(
                "opened"
            );

        }
    );

}


// ==============================
// زر إنشاء رسالة جديدة
// ==============================

if (shareButton) {

    shareButton.addEventListener(
        "click",
        () => {
            window.location.href = "/";
        }
    );

}


// ==============================
// تشغيل
// ==============================

loadMessage();

const nameElement = document.getElementById("name");
const messageElement = document.getElementById("message");
const shareButton = document.getElementById("shareButton");


// =====================================
// قراءة بيانات الرسالة من الرابط
// =====================================

function getMessageData() {

    const params =
        new URLSearchParams(
            window.location.search
        );

    const encoded =
        params.get("data");

    if (!encoded) {
        return null;
    }

    try {

        return JSON.parse(encoded);

    } catch (error) {

        console.error(
            "Invalid message data:",
            error
        );

        return null;
    }
}


// =====================================
// فتح الرسالة
// =====================================

function loadMessage() {

    const data =
        getMessageData();


    if (!data) {

        nameElement.textContent =
            "عذرًا";

        messageElement.textContent =
            "الرابط غير صحيح ❌";

        return;
    }


    // اسم الشخص
    nameElement.textContent =
        data.name || "شخص ما";


    // نص الرسالة
    messageElement.textContent =
        data.message || "لا توجد رسالة 💌";


    // إظهار بطاقة الرسالة
    const card =
        document.querySelector(
            ".message-card"
        );

    if (card) {

        card.style.display =
            "block";

    }

}


// =====================================
// زر إرسال رسالة جديدة
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

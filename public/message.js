const nameElement =
    document.getElementById("name");

const messageElement =
    document.getElementById("message");

const shareButton =
    document.getElementById("shareButton");


// ==============================
// الحصول على ID من الرابط
// ==============================

const pathParts =
    window.location.pathname.split("/");

const messageId =
    pathParts[pathParts.length - 1];


// ==============================
// تحميل الرسالة
// ==============================

async function loadMessage() {

    if (!messageId) {

        messageElement.textContent =
            "الرابط غير صحيح ❌";

        return;
    }


    try {

        const response =
            await fetch(
                `/api/message/${encodeURIComponent(messageId)}`
            );


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.error ||
                "تعذر فتح الرسالة"
            );

        }


        // اسم الشخص

        nameElement.textContent =
            data.name;


        // الرسالة

        messageElement.textContent =
            data.message;


    } catch (error) {

        nameElement.textContent =
            "عذرًا";

        messageElement.textContent =
            error.message ||
            "تعذر تحميل الرسالة ❌";

    }

}


// ==============================
// زر إنشاء رسالة جديدة
// ==============================

shareButton.addEventListener(
    "click",
    () => {

        window.location.href = "/";

    }
);


// تشغيل التحميل

loadMessage();

const nameElement =
    document.getElementById("name");

const messageElement =
    document.getElementById("message");

const shareButton =
    document.getElementById("shareButton");


// =====================================
// الحصول على ID الرسالة من الرابط
// =====================================

function getMessageId() {

    const parts =
        window.location.pathname
            .split("/")
            .filter(Boolean);

    const messageIndex =
        parts.indexOf("message");

    if (
        messageIndex !== -1 &&
        parts[messageIndex + 1]
    ) {
        return parts[messageIndex + 1];
    }

    return null;
}


// =====================================
// تحميل الرسالة
// =====================================

async function loadMessage() {

    const messageId =
        getMessageId();


    // إذا ماكو ID
    if (!messageId) {

        nameElement.textContent =
            "عذرًا";

        messageElement.textContent =
            "الرابط غير صحيح ❌";

        return;
    }


    try {

        const response =
            await fetch(
                `/api/message/${encodeURIComponent(messageId)}`
            );


        const text =
            await response.text();


        let data;

        try {

            data =
                JSON.parse(text);

        } catch {

            throw new Error(
                "السيرفر لم يرجع بيانات صحيحة ❌"
            );
        }


        if (!response.ok) {

            throw new Error(
                data.error ||
                "تعذر فتح الرسالة ❌"
            );
        }


        // =================================
        // عرض البيانات
        // =================================

        nameElement.textContent =
            data.name || "شخص ما";

        messageElement.textContent =
            data.message || "لا توجد رسالة";


        // إظهار بطاقة الرسالة
        const result =
            document.querySelector(".result");

        if (result) {

            result.classList.remove("hidden");

            result.style.display =
                "block";

        }


    } catch (error) {

        console.error(error);

        nameElement.textContent =
            "عذرًا";

        messageElement.textContent =
            error.message ||
            "تعذر تحميل الرسالة ❌";


        const result =
            document.querySelector(".result");

        if (result) {

            result.classList.remove("hidden");

            result.style.display =
                "block";

        }

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

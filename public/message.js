const nameElement =
    document.getElementById("name");

const messageElement =
    document.getElementById("message");

const shareButton =
    document.getElementById("shareButton");

const openScreen =
    document.getElementById("openScreen");

const messageCard =
    document.getElementById("messageCard");

const openButton =
    document.getElementById("openMessage");

const envelope =
    document.getElementById("envelope");


// =================================
// الحصول على ID من الرابط
// =================================

const parts =
    window.location.pathname
        .split("/")
        .filter(Boolean);

const messageId =
    parts[parts.length - 1];


// =================================
// جلب الرسالة
// =================================

async function loadMessage() {

    if (
        !messageId ||
        messageId === "message"
    ) {

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


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.error ||
                "تعذر فتح الرسالة"
            );

        }


        // الاسم

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


// =================================
// فتح الرسالة
// =================================

openButton.addEventListener(
    "click",
    () => {

        // حركة الظرف

        envelope.style.transform =
            "scale(1.25) rotate(8deg)";


        openButton.disabled =
            true;


        // إخفاء شاشة الانتظار

        openScreen.style.opacity =
            "0";

        openScreen.style.transform =
            "translateY(15px) scale(.96)";


        setTimeout(() => {

            openScreen.style.display =
                "none";


            // إظهار الرسالة

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


// =================================
// زر إنشاء رسالة جديدة
// =================================

shareButton.addEventListener(
    "click",
    () => {

        window.location.href = "/";

    }
);


// =================================
// تشغيل
// =================================

loadMessage();

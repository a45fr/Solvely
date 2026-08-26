const nameElement =
    document.getElementById("name");

const messageElement =
    document.getElementById("message");

const openScreen =
    document.getElementById("openScreen");

const openButton =
    document.getElementById("openMessage");

const messageCard =
    document.getElementById("messageCard");

const envelope =
    document.getElementById("envelope");

const shareButton =
    document.getElementById("shareButton");


// =====================================
// الحصول على ID الرسالة
// =====================================

function getMessageId() {

    const parts =
        window.location.pathname
            .split("/")
            .filter(Boolean);

    const index =
        parts.indexOf("message");

    if (
        index !== -1 &&
        parts[index + 1]
    ) {
        return parts[index + 1];
    }

    return null;
}


// =====================================
// تحميل الرسالة من KV
// =====================================

async function loadMessage() {

    const id =
        getMessageId();

    if (!id) {

        nameElement.textContent =
            "عذرًا";

        messageElement.textContent =
            "الرابط غير صحيح ❌";

        return;
    }


    try {

        const response =
            await fetch(
                `/api/message/${encodeURIComponent(id)}`
            );


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.error ||
                "تعذر فتح الرسالة ❌"
            );
        }


        // الاسم

        nameElement.textContent =
            data.name || "شخص ما";


        // الرسالة

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

openButton.addEventListener(
    "click",
    () => {

        openButton.disabled = true;

        openButton.textContent =
            "جاري فتح الرسالة... 💌";


        // حركة الظرف

        envelope.style.transform =
            "scale(1.2) rotate(8deg)";


        setTimeout(() => {

            // إخفاء شاشة الفتح

            openScreen.style.opacity =
                "0";

            openScreen.style.transform =
                "translateY(20px) scale(.95)";


        }, 150);


        setTimeout(() => {

            openScreen.style.display =
                "none";


            // إظهار الرسالة

            messageCard.style.display =
                "block";

            messageCard.style.opacity =
                "0";

            messageCard.style.transform =
                "translateY(25px) scale(.96)";


            requestAnimationFrame(() => {

                messageCard.style.opacity =
                    "1";

                messageCard.style.transform =
                    "translateY(0) scale(1)";

            });


            // نزول للرسالة

            setTimeout(() => {

                messageCard.scrollIntoView({
                    behavior: "smooth",
                    block: "center"
                });

            }, 150);


        }, 550);

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

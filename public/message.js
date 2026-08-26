const nameElement = document.getElementById("name");
const messageElement = document.getElementById("message");

const openScreen = document.getElementById("openScreen");
const openMessage = document.getElementById("openMessage");
const messageCard = document.getElementById("messageCard");

const shareButton = document.getElementById("shareButton");


// =====================================
// استخراج ID من الرابط
// =====================================

function getMessageId() {

    const parts =
        window.location.pathname
            .split("/")
            .filter(Boolean);

    // الرابط الصحيح:
    // /message/xxxxxxxxxxxx

    if (
        parts[0] === "message" &&
        parts[1]
    ) {
        return parts[1];
    }

    return null;
}


// =====================================
// جلب الرسالة من KV
// =====================================

async function loadMessage() {

    const id = getMessageId();

    console.log("Message ID:", id);

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


        console.log("Message data:", data);


        if (!response.ok) {

            throw new Error(
                data.error ||
                "تعذر فتح الرسالة ❌"
            );
        }


        // تخزين البيانات بالصفحة
        nameElement.textContent =
            data.name || "شخص ما";

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
// زر فتح الرسالة
// =====================================

if (openMessage) {

    openMessage.addEventListener(
        "click",
        () => {

            openScreen.style.display =
                "none";

            messageCard.style.display =
                "block";

            messageCard.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });

        }
    );

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

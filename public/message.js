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
// الحصول على ID الرسالة من الرابط
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

        nameElement.textContent =
            data.name || "شخص ما";

        messageElement.textContent =
            data.message || "لا توجد رسالة";

    } catch (error) {

        console.error(
            "Message loading error:",
            error
        );

        nameElement.textContent =
            "عذرًا";

        messageElement.textContent =
            error.message ||
            "تعذر تحميل الرسالة ❌";
    }
}


// =====================================
// إنشاء القلوب والتأثيرات
// =====================================

function createHearts() {

    const hearts = [
        "❤️",
        "💗",
        "💕",
        "💖",
        "💜",
        "✨"
    ];

    for (let i = 0; i < 12; i++) {

        const heart =
            document.createElement("div");

        heart.className =
            "heart-particle";

        heart.textContent =
            hearts[
                Math.floor(
                    Math.random() *
                    hearts.length
                )
            ];

        heart.style.left =
            `${15 + Math.random() * 70}%`;

        heart.style.bottom =
            `${20 + Math.random() * 20}%`;

        heart.style.animationDelay =
            `${Math.random() * 0.5}s`;

        document.body.appendChild(
            heart
        );

        setTimeout(() => {

            heart.remove();

        }, 2200);
    }
}


// =====================================
// فتح الرسالة
// =====================================

if (openButton) {

    openButton.addEventListener(
        "click",
        () => {

            openButton.disabled =
                true;

            openButton.textContent =
                "جاري فتح الرسالة... 💌";


            // حركة الظرف

            if (envelope) {

                envelope.style.transform =
                    "scale(1.25) rotate(8deg)";
            }


            // إطلاق القلوب

            createHearts();


            // بداية إخفاء شاشة الفتح

            setTimeout(() => {

                openScreen.style.opacity =
                    "0";

                openScreen.style.transform =
                    "translateY(20px) scale(.95)";

            }, 150);


            // إظهار الرسالة

            setTimeout(() => {

                openScreen.style.display =
                    "none";


                messageCard.style.display =
                    "block";

                messageCard.style.opacity =
                    "0";

                messageCard.style.transform =
                    "translateY(25px) scale(.92)";


                requestAnimationFrame(() => {

                    messageCard.style.opacity =
                        "1";

                    messageCard.style.transform =
                        "translateY(0) scale(1)";

                    messageCard.classList.add(
                        "message-opened"
                    );

                });


                // النزول للرسالة

                setTimeout(() => {

                    messageCard.scrollIntoView({
                        behavior: "smooth",
                        block: "center"
                    });

                }, 200);


            }, 600);

        }
    );

}


// =====================================
// زر إنشاء رسالة جديدة
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
// تشغيل الموقع
// =====================================

loadMessage();

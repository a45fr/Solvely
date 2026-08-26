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

const particles =
    document.getElementById("particles");


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
// تحميل الرسالة
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

        console.error(error);

        nameElement.textContent =
            "عذرًا";

        messageElement.textContent =
            error.message ||
            "تعذر تحميل الرسالة ❌";
    }
}


// =====================================
// إنشاء الجزيئات
// =====================================

function createParticles() {

    const symbols = [
        "❤️",
        "💗",
        "💕",
        "💖",
        "💜",
        "✨",
        "♡",
        "✦"
    ];

    for (let i = 0; i < 24; i++) {

        const particle =
            document.createElement("div");

        particle.className =
            "heart-particle";

        particle.textContent =
            symbols[
                Math.floor(
                    Math.random() *
                    symbols.length
                )
            ];

        particle.style.left =
            `${10 + Math.random() * 80}%`;

        particle.style.top =
            `${45 + Math.random() * 15}%`;

        particle.style.animationDelay =
            `${Math.random() * 0.6}s`;

        particle.style.fontSize =
            `${12 + Math.random() * 14}px`;

        particles.appendChild(
            particle
        );

        setTimeout(() => {
            particle.remove();
        }, 2600);
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

            openButton.innerHTML =
                "جاري فتحها... 💌";


            createParticles();


            if (envelope) {

                envelope.classList.add(
                    "envelope-opening"
                );
            }


            setTimeout(() => {

                openScreen.classList.add(
                    "screen-closing"
                );

            }, 250);


            setTimeout(() => {

                openScreen.style.display =
                    "none";

                messageCard.style.display =
                    "block";

                messageCard.classList.add(
                    "message-enter"
                );


                setTimeout(() => {

                    messageCard.scrollIntoView({
                        behavior: "smooth",
                        block: "center"
                    });

                }, 250);

            }, 700);

        }
    );
}


// =====================================
// رسالة جديدة
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
// التشغيل
// =====================================

loadMessage();

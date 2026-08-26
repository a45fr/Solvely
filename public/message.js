const nameElement =
  document.getElementById("name");

const messageElement =
  document.getElementById("message");

const shareButton =
  document.getElementById("shareButton");


// ==============================
// قراءة الرسالة من الرابط
// ==============================

function loadMessage() {
  try {
    const params =
      new URLSearchParams(window.location.search);

    const encoded =
      params.get("data");

    if (!encoded) {
      throw new Error("الرابط غير صحيح ❌");
    }

    const data =
      JSON.parse(
        decodeURIComponent(encoded)
      );

    if (!data.name || !data.message) {
      throw new Error("الرسالة غير موجودة ❌");
    }

    nameElement.textContent =
      data.name;

    messageElement.textContent =
      data.message;

  } catch (error) {

    nameElement.textContent =
      "عذرًا";

    messageElement.textContent =
      error.message ||
      "تعذر فتح الرسالة ❌";
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


// تشغيل
loadMessage();

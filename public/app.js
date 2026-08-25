const nameInput = document.getElementById("name");
const messageInput = document.getElementById("message");
const count = document.getElementById("count");
const createBtn = document.getElementById("createBtn");
const result = document.getElementById("result");
const generatedLink = document.getElementById("generatedLink");
const copyBtn = document.getElementById("copyBtn");
const shareBtn = document.getElementById("shareBtn");

messageInput.addEventListener("input", () => {
  count.textContent = `${messageInput.value.length} / 500`;
});

createBtn.addEventListener("click", async () => {
  const name = nameInput.value.trim();
  const message = messageInput.value.trim();

  if (!name) {
    alert("اكتب اسم الشخص أولاً 💜");
    return;
  }

  if (!message) {
    alert("اكتب الرسالة أولاً 💌");
    return;
  }

  createBtn.disabled = true;
  createBtn.textContent = "جاري إنشاء الرابط... ⏳";

  try {
    const response = await fetch("/api/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: name,
        message: message
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "حدث خطأ");
    }

    generatedLink.value = data.url;
    result.classList.remove("hidden");

    result.scrollIntoView({
      behavior: "smooth",
      block: "center"
    });

  } catch (error) {
    alert("ما قدر ينشئ الرابط ❌\n" + error.message);
  }

  createBtn.disabled = false;
  createBtn.innerHTML = `
    <span>إنشاء الرابط</span>
    <span>✨</span>
  `;
});

copyBtn.addEventListener("click", async () => {
  if (!generatedLink.value) return;

  await navigator.clipboard.writeText(generatedLink.value);

  copyBtn.textContent = "تم ✓";

  setTimeout(() => {
    copyBtn.textContent = "نسخ";
  }, 2000);
});

shareBtn.addEventListener("click", async () => {
  const url = generatedLink.value;

  if (!url) return;

  if (navigator.share) {
    await navigator.share({
      title: "رسالة من Solvely 💌",
      text: "وصلك رابط رسالة 💌",
      url: url
    });
  } else {
    await navigator.clipboard.writeText(url);
    alert("تم نسخ الرابط ❤️");
  }
});

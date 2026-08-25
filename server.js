const express = require("express");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const app = express();
const PORT = 3000;

const DATA_DIR = path.join(__dirname, "data");
const DATA_FILE = path.join(DATA_DIR, "messages.json");

// إنشاء مجلد البيانات إذا غير موجود
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}

// إنشاء ملف قاعدة البيانات إذا غير موجود
if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, "{}", "utf8");
}

app.use(express.json({ limit: "10kb" }));

// ملفات الموقع
app.use(express.static(path.join(__dirname, "public")));


// ==============================
// قراءة الرسائل
// ==============================

function loadMessages() {
    try {
        return JSON.parse(
            fs.readFileSync(DATA_FILE, "utf8")
        );
    } catch (error) {
        console.error("Database read error:", error);
        return {};
    }
}


// ==============================
// حفظ الرسائل
// ==============================

function saveMessages(messages) {
    fs.writeFileSync(
        DATA_FILE,
        JSON.stringify(messages, null, 2),
        "utf8"
    );
}


// ==============================
// إنشاء ID عشوائي
// ==============================

function createId() {
    return crypto
        .randomBytes(6)
        .toString("base64url");
}


// ==============================
// إنشاء رسالة
// ==============================

app.post("/api/create", (req, res) => {

    const name = String(
        req.body.name || ""
    ).trim();

    const message = String(
        req.body.message || ""
    ).trim();


    if (!name) {
        return res.status(400).json({
            error: "اكتب اسم الشخص أولاً"
        });
    }


    if (!message) {
        return res.status(400).json({
            error: "اكتب الرسالة أولاً"
        });
    }


    if (name.length > 30) {
        return res.status(400).json({
            error: "الاسم طويل جدًا"
        });
    }


    if (message.length > 500) {
        return res.status(400).json({
            error: "الرسالة طويلة جدًا"
        });
    }


    const id = createId();

    const messages = loadMessages();


    messages[id] = {
        id: id,
        name: name,
        message: message,
        views: 0,
        createdAt: new Date().toISOString()
    };


    saveMessages(messages);


    const url =
        `${req.protocol}://${req.get("host")}/m/${id}`;


    res.json({
        success: true,
        id: id,
        url: url
    });

});


// ==============================
// جلب رسالة
// ==============================

app.get("/api/message/:id", (req, res) => {

    const messages = loadMessages();

    const data =
        messages[req.params.id];


    if (!data) {
        return res.status(404).json({
            error: "هذه الرسالة غير موجودة"
        });
    }


    // زيادة المشاهدات
    data.views += 1;

    saveMessages(messages);


    res.json({
        name: data.name,
        message: data.message,
        views: data.views,
        createdAt: data.createdAt
    });

});


// ==============================
// صفحة الرسالة
// ==============================

app.get("/m/:id", (req, res) => {

    res.sendFile(
        path.join(
            __dirname,
            "public",
            "message.html"
        )
    );

});


// ==============================
// الصفحة الرئيسية
// ==============================

app.get("/", (req, res) => {

    res.sendFile(
        path.join(
            __dirname,
            "public",
            "index.html"
        )
    );

});


// ==============================
// صفحة غير موجودة
// ==============================

app.use((req, res) => {

    res.status(404).send(`
<!DOCTYPE html>

<html lang="ar" dir="rtl">

<head>

<meta charset="UTF-8">

<meta
name="viewport"
content="width=device-width, initial-scale=1.0"
>

<title>Solvely</title>

</head>

<body style="
margin:0;
background:#100d1d;
color:white;
font-family:Arial;
text-align:center;
padding:90px 20px;
">

<div style="
font-size:70px;
margin-bottom:20px;
">
💌
</div>

<h1>
الرابط غير موجود
</h1>

<p style="
color:#aaa;
line-height:1.8;
">
يبدو أن الرابط الذي فتحته غير صحيح
أو أن الرسالة غير موجودة.
</p>

<a
href="/"
style="
display:inline-block;
margin-top:20px;
padding:15px 25px;
background:#8b5cf6;
color:white;
text-decoration:none;
border-radius:15px;
"
>
العودة إلى Solvely
</a>

</body>

</html>
`);

});


// ==============================
// تشغيل الموقع
// ==============================

app.listen(
    PORT,
    "0.0.0.0",
    () => {

        console.log("");
        console.log("================================");
        console.log("💌 SOLVELY");
        console.log("================================");
        console.log(
            `🚀 http://localhost:${PORT}`
        );
        console.log("================================");
        console.log("");

    }
);

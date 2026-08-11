export default {
async fetch(request, env) {
const url = new URL(request.url);

// اختبار حالة اتصال OpenAI
if (url.pathname === "/api/health") {
return Response.json({
aiStatus: env.OPENAI_API_KEY ? "connected" : "offline"
});
}

// اختبار طلب OpenAI حقيقي
if (url.pathname === "/api/ai-test" && request.method === "POST") {
if (!env.OPENAI_API_KEY) {
return Response.json(
{ error: "OPENAI_API_KEY غير موجود" },
{ status: 500 }
);
}

const response = await fetch("https://api.openai.com/v1/responses", {
method: "POST",
headers: {
"Content-Type": "application/json",
"Authorization": Bearer ${env.OPENAI_API_KEY}
},
body: JSON.stringify({
model: "gpt-5-mini",
input: "قل: تم الاتصال بـ StudyMind بنجاح."
})
});

const data = await response.json();

return Response.json(data, {
status: response.status
});
}

// عرض ملفات الموقع الموجودة داخل public
return env.ASSETS.fetch(request);
}
};

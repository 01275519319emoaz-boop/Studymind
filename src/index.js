```js
export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // اختبار حالة اتصال Gemini
    if (url.pathname === "/api/health") {
      return Response.json({
        aiStatus: env.GEMINI_API_KEY ? "connected" : "offline"
      });
    }

    // اختبار طلب Gemini حقيقي
    if (url.pathname === "/api/ai-test" && request.method === "POST") {
      if (!env.GEMINI_API_KEY) {
        return Response.json(
          { error: "GEMINI_API_KEY غير موجود" },
          { status: 500 }
        );
      }

      const response = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-goog-api-key": env.GEMINI_API_KEY
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: "قل: تم الاتصال بـ StudyMind بنجاح."
                  }
                ]
              }
            ]
          })
        }
      );

      const data = await response.json();

      return Response.json(data, {
        status: response.status
      });
    }

    // عرض ملفات الموقع الموجودة داخل public
    return env.ASSETS.fetch(request);
  }
};
```

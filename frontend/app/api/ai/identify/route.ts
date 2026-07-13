import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: Request) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      console.error("GEMINI_API_KEY is not set");
      return Response.json({ error: "AI service not configured" }, { status: 500 });
    }

    let imageBase64: string | undefined;
    let mimeType: string;
    try {
      const body = await req.json();
      imageBase64 = body.imageBase64;
      mimeType = body.mimeType || "image/jpeg";
    } catch {
      return Response.json({ error: "Invalid request body" }, { status: 400 });
    }

    if (!imageBase64) {
      return Response.json({ error: "No image provided" }, { status: 400 });
    }

    const base64Data = imageBase64.includes(",") ? imageBase64.split(",")[1] : imageBase64;

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent([
      {
        inlineData: {
          mimeType: mimeType,
          data: base64Data,
        },
      },
      `You are an expert aquarium fish identifier. Analyze this image carefully.

If you can identify a fish or aquatic animal, respond with exactly this format:

**Fish Name:** [Common name] / [Scientific name]
**Origin:** [Geographic origin]
**Care Level:** [Beginner / Intermediate / Expert]
**Minimum Tank Size:** [X gallons / X litres]
**Water Temperature:** [X°C – X°C]
**pH Range:** [X.X – X.X]
**Compatible With:** [List of compatible fish]
**Diet:** [What to feed]
**Special Notes:** [Key care tips]

If the image does not show a fish or aquatic animal clearly, say:
"I couldn't identify a fish in this image. Please upload a clear photo of a fish."`,
    ]);

    const text = result.response.text();
    return Response.json({ result: text });
  } catch (err) {
    console.error("=== /api/ai/identify ERROR ===");
    console.error("Message:", (err as Error).message);
    console.error("Stack:", (err as Error).stack);
    console.error("==============================");

    return Response.json(
      { error: "Could not identify the fish", detail: (err as Error).message },
      { status: 500 }
    );
  }
}

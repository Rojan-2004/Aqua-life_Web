import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: Request) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      console.error("GEMINI_API_KEY is not set");
      return Response.json({ error: "AI service not configured" }, { status: 500 });
    }

    let messages;
    try {
      const body = await req.json();
      messages = body.messages;
    } catch {
      return Response.json({ error: "Invalid request body" }, { status: 400 });
    }

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return Response.json({ error: "No messages provided" }, { status: 400 });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

    const systemExchange = [
      {
        role: "user",
        parts: [
          {
            text: "You are AquaBot, an expert AI assistant for AquaLife, a premium aquarium e-commerce platform. You help with fish care, aquarium setup, water chemistry, plant care, equipment, disease diagnosis, and product recommendations. Be friendly, concise, and always prioritize fish wellbeing. If asked about something unrelated to aquariums, gently redirect back to aquatic topics.",
          },
        ],
      },
      {
        role: "model",
        parts: [
          {
            text: "Understood! I'm AquaBot, your aquarium expert. I'm ready to help with fish care, tank setup, water chemistry, plants, equipment, and anything else aquatic. What can I help you with today?",
          },
        ],
      },
    ];

    const history = [
      ...systemExchange,
      ...messages.slice(0, -1).map((m: { role: string; content: string }) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }],
      })),
    ];

    const lastUserMessage = messages[messages.length - 1].content;

    const chat = model.startChat({ history });
    const result = await chat.sendMessageStream(lastUserMessage);

    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of result.stream) {
            const text = chunk.text();
            if (text) {
              controller.enqueue(new TextEncoder().encode(text));
            }
          }
        } catch (streamErr) {
          console.error("Stream error:", streamErr);
          controller.enqueue(new TextEncoder().encode("\n[Stream interrupted]"));
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      status: 200,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache, no-store",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (err) {
    console.error("=== /api/ai/chat ERROR ===");
    console.error("Message:", (err as Error).message);
    console.error("Stack:", (err as Error).stack);
    console.error("=========================");

    return Response.json(
      { error: "AI service error", detail: (err as Error).message },
      { status: 500 }
    );
  }
}

const schema = {
  type: "object",
  properties: {
    meal_name: { type: "string" },
    confidence: { type: "string", enum: ["low", "medium", "high"] },
    items: {
      type: "array",
      items: {
        type: "object",
        properties: {
          name: { type: "string" },
          grams: { type: "number" },
          kcal: { type: "number" },
          p: { type: "number" },
          c: { type: "number" },
          f: { type: "number" },
          info: { type: "string" }
        },
        required: ["name", "grams", "kcal", "p", "c", "f", "info"],
        additionalProperties: false
      }
    }
  },
  required: ["meal_name", "confidence", "items"],
  additionalProperties: false
};

export default async (req) => {
  if (req.method !== "POST") return Response.json({ error: "Method not allowed" }, { status: 405 });
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return Response.json({ error: "OPENAI_API_KEY is not configured in Netlify." }, { status: 500 });

  try {
    const { image, plateDescription = "plate size unknown" } = await req.json();
    if (!image || !String(image).startsWith("data:image/")) {
      return Response.json({ error: "No valid meal image received." }, { status: 400 });
    }

    const prompt = `Analyze this meal photo for a calorie-tracking app. The serving container is: ${plateDescription}.
Identify only foods that are visibly present. Do not invent side dishes or ingredients you cannot see.
For each visible food component, estimate edible portion weight in grams, calories, protein, carbs, and fat.
Use the plate/container size only as a rough scale reference. For mixed dishes or sauces, name them conservatively and state uncertainty in info.
The short info field should explain what you think the item is and any important assumption (cooking method, sauce, hidden oil, etc.).
Nutrition values are estimates, not laboratory measurements. If recognition or portion size is uncertain, use low/medium confidence rather than pretending precision.`;

    const body = {
      model: process.env.OPENAI_MODEL || "gpt-6-luna",
      input: [{
        role: "user",
        content: [
          { type: "input_text", text: prompt },
          { type: "input_image", image_url: image, detail: "high" }
        ]
      }],
      text: {
        format: {
          type: "json_schema",
          name: "food_scan",
          strict: true,
          schema
        }
      },
      max_output_tokens: 2200
    };

    const r = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: { "authorization": `Bearer ${apiKey}`, "content-type": "application/json" },
      body: JSON.stringify(body)
    });
    const out = await r.json();
    if (!r.ok) {
      const message = out?.error?.message || `OpenAI request failed (${r.status})`;
      return Response.json({ error: message }, { status: 502 });
    }

    const text = out.output_text || out.output?.flatMap(x => x.content || []).find(x => x.type === "output_text")?.text;
    if (!text) return Response.json({ error: "AI returned no analysis." }, { status: 502 });
    const parsed = JSON.parse(text);
    return Response.json(parsed);
  } catch (err) {
    console.error(err);
    return Response.json({ error: err?.message || "Food analysis failed." }, { status: 500 });
  }
};

export const config = { path: "/.netlify/functions/analyze-food" };

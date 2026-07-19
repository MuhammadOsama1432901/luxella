import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import type { JewelryCategory } from "@/components/tryon/jewelryData";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || "dummy-key-for-build" });

// Default placements per jewelry type (fallback when no API key / vision fails)
const DEFAULTS: Record<JewelryCategory, Array<{ x: number; y: number; width: number; rotation: number }>> = {
  necklace: [{ x: 0.50, y: 0.52, width: 0.55, rotation: 0 }],
  earring:  [{ x: 0.35, y: 0.44, width: 0.07, rotation: 0 }, { x: 0.65, y: 0.44, width: 0.07, rotation: 0 }],
  ring:     [{ x: 0.60, y: 0.62, width: 0.13, rotation: -10 }],
  bracelet: [{ x: 0.50, y: 0.52, width: 0.38, rotation: 0 }],
  watch:    [{ x: 0.50, y: 0.52, width: 0.38, rotation: 0 }],
  anklet:   [{ x: 0.50, y: 0.65, width: 0.40, rotation: 10 }],
  nosepin:  [{ x: 0.48, y: 0.50, width: 0.08, rotation: 0 }],
};

// GPT-4o prompts revised to return a root JSON object { "placements": [...] } for OpenAI JSON mode compliance
const PROMPTS: Record<JewelryCategory, string> = {
  necklace: `Detect the neck/collarbone area in this chest-up photo. Return a JSON object with a "placements" array of ONE placement object for centering a necklace:
{
  "placements": [{"x":0.5,"y":0.55,"width":0.55,"rotation":0}]
}
- x,y: center of the collarbone/upper-chest area as 0-1 fractions of image width/height
- width: how wide the necklace should be, as a fraction of image width (typically 0.4–0.65)
- rotation: tilt angle in degrees (usually 0 unless head is very tilted)
Ensure you return only valid JSON matching this schema.`,

  earring: `Detect BOTH ear positions in this portrait/selfie image. Return a JSON object with a "placements" array of TWO placement objects, one per ear:
{
  "placements": [{"x":0.3,"y":0.42,"width":0.07,"rotation":0},{"x":0.7,"y":0.42,"width":0.07,"rotation":0}]
}
- x,y: position of each earlobe as 0-1 fractions of image dimensions
- width: earring width relative to image width (typically 0.04–0.10)
- rotation: 0 for most cases
Ensure you return only valid JSON matching this schema.`,

  ring: `Detect a finger (preferably ring finger) in this hand photo. Return a JSON object with a "placements" array of ONE placement:
{
  "placements": [{"x":0.55,"y":0.6,"width":0.12,"rotation":-10}]
}
- x,y: center of the ring finger's middle joint as 0-1 fractions
- width: finger width as fraction of image width (typically 0.06–0.15)
- rotation: angle of the finger in degrees (negative = tilted left, positive = tilted right)
Ensure you return only valid JSON matching this schema.`,

  bracelet: `Detect the wrist in this photo. Return a JSON object with a "placements" array of ONE placement:
{
  "placements": [{"x":0.5,"y":0.5,"width":0.35,"rotation":0}]
}
- x,y: center of the wrist as 0-1 fractions of image dimensions
- width: wrist width as fraction of image width (typically 0.25–0.45)
- rotation: wrist angle in degrees (0 if horizontal)
Ensure you return only valid JSON matching this schema.`,

  watch: `Detect the wrist in this photo. Return a JSON object with a "placements" array of ONE placement for a wrist watch:
{
  "placements": [{"x":0.5,"y":0.5,"width":0.35,"rotation":0}]
}
- x,y: center of the wrist as 0-1 fractions of image dimensions
- width: watch width as fraction of image width (typically 0.25–0.45)
- rotation: wrist watch angle in degrees (0 if horizontal)
Ensure you return only valid JSON matching this schema.`,

  anklet: `Detect the ankle/foot joint in this photo. Return a JSON object with a "placements" array of ONE placement for an ankle chain/anklet:
{
  "placements": [{"x":0.5,"y":0.68,"width":0.45,"rotation":8}]
}
- x,y: center of ankle bone/wrist as 0-1 fractions of image dimensions
- width: ankle width relative to image width (typically 0.30–0.50)
- rotation: tilt angle of foot (usually 5–15 degrees)
Ensure you return only valid JSON matching this schema.`,

  nosepin: `Detect the side or tip of the nose in this close-up face/selfie image. Return a JSON object with a "placements" array of ONE placement:
{
  "placements": [{"x":0.48,"y":0.50,"width":0.07,"rotation":0}]
}
- x,y: position of the nose wing/nostril (left or right side where nose pin goes) as 0-1 fractions
- width: size of nose pin relative to image width (typically 0.04–0.08)
- rotation: 0
Ensure you return only valid JSON matching this schema.`,
};

const AUTO_DETECT_PROMPT = `Analyze this photo. Identify which body part is most prominent:
1. Neck/collarbone area -> category: "necklace"
2. Earlobe/face area -> category: "earring"
3. Hand/finger area -> category: "ring"
4. Wrist area -> category: "bracelet" or "watch" (choose "bracelet" as default for wrists)
5. Foot/ankle area -> category: "anklet"
6. Nose area -> category: "nosepin"

Once you identify the category, calculate the target coordinates (x,y, width, rotation) exactly as described below:
- For "necklace": x,y is upper-chest center, width is 0.45-0.65
- For "earring": x,y for BOTH earlobes (return exactly 2 objects)
- For "ring": x,y center of ring finger joint
- For "bracelet": x,y center of the wrist
- For "anklet": x,y center of the ankle bone
- For "nosepin": x,y position of the nose wing/nostril

Return a JSON object matching this schema:
{
  "category": "necklace" | "earring" | "ring" | "bracelet" | "watch" | "anklet" | "nosepin",
  "placements": [ { "x": ..., "y": ..., "width": ..., "rotation": ... } ]
}
Ensure you return only valid JSON matching this schema.`;

export async function POST(req: NextRequest) {
  try {
    const { imageBase64, jewelryType } = await req.json() as {
      imageBase64: string;
      jewelryType: JewelryCategory | "auto";
    };

    const isAuto = jewelryType === "auto";

    // No API key — return smart mock auto-detection or defaults with processing delay
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === "sk-your-openai-key-here") {
      await new Promise((r) => setTimeout(r, 1200));

      if (isAuto) {
        const categories: JewelryCategory[] = ["necklace", "earring", "ring", "bracelet", "watch", "anklet", "nosepin"];
        const randomCat = categories[Math.floor(Math.random() * categories.length)];
        return NextResponse.json({
          category: randomCat,
          placements: DEFAULTS[randomCat],
        });
      }

      return NextResponse.json({ placements: DEFAULTS[jewelryType as JewelryCategory || "bracelet"] });
    }

    const systemContent = isAuto ? AUTO_DETECT_PROMPT : PROMPTS[jewelryType as JewelryCategory || "bracelet"];

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      response_format: { type: "json_object" }, // Enforce JSON mode for 100% structured reliability
      messages: [
        {
          role: "system",
          content: systemContent,
        },
        {
          role: "user",
          content: [
            {
              type: "image_url",
              image_url: { url: imageBase64, detail: "low" },
            },
          ],
        },
      ],
      max_tokens: 250,
      temperature: 0.1,
    });

    const content = response.choices[0]?.message?.content || "{}";
    const result = JSON.parse(content);

    return NextResponse.json(result);
  } catch (err) {
    console.error("Try-On API error:", err);
    try {
      const body = await req.clone().json().catch(() => ({ jewelryType: "bracelet" }));
      const type = body.jewelryType === "auto" ? "bracelet" : (body.jewelryType || "bracelet");
      return NextResponse.json({
        category: type,
        placements: DEFAULTS[type as JewelryCategory],
      });
    } catch {
      return NextResponse.json({
        category: "bracelet",
        placements: DEFAULTS["bracelet"],
      });
    }
  }
}

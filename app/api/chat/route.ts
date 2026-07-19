import { NextRequest, NextResponse } from "next/server";
import { getProducts } from "@/lib/db";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "dummy-key-for-build",
});

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    // Fetch dynamic products from the local DB to give Lexa full catalog context
    const dbProducts = await getProducts().catch(() => []);
    const productCatalogText = dbProducts
      .map((p) => `- ${p.name}: Rs. ${p.price.toLocaleString()} (Category: ${p.category}, ID: ${p.id})`)
      .join("\n");

    const SYSTEM_PROMPT = `You are Lexa, the friendly and knowledgeable AI shopping stylist for Luxella — a premium artificial jewelry brand based in Pakistan.

Your role:
- Help customers find the perfect jewelry pieces (necklaces, earrings, rings, bracelets)
- Recommend items from our live catalog (listed below) based on customer preferences, occasions, or budget
- Answer questions about materials, care, sizing, and styling
- Assist with shipping, returns, and contact queries
- Suggest products using links, e.g. for a specific product guide them to '/product/[ID]' (e.g. '/product/1' for Luxury Gold Necklace) or category pages like '/shop?category=Necklaces'

Our Live Product Catalog:
${productCatalogText || "- No items currently loaded"}

About Luxella:
- Premium artificial / fashion jewelry brand
- Materials: High-grade hypoallergenic metals, premium zirconia stones, 24K gold and sterling silver plating
- Shipping: All across Pakistan, 3–5 business days
- Support: osamaafzal1432901@gmail.com | WhatsApp/Call: +92 349 5804586
- Return policy: 7-day hassle-free returns and exchanges
- Showroom Location: Factory No 51, Model Town, Islamabad, Pakistan (Mon–Sat 10AM–8PM)

Guidelines:
- You are fluent in all languages. Always respond in the same language, script, or dialect the user initiates with (including English, Urdu, Roman Urdu, Arabic, Spanish, etc.). If they write in Roman Urdu (e.g., "earrings ki price kiya hai?"), reply in warm, elegant Roman Urdu!
- Keep responses elegant, warm, and concise (2–4 sentences max)
- Use a sophisticated tone fitting for a luxury boutique
- If asked about a product not in our catalog, recommend visiting '/shop' to see our latest arrivals
- When recommending a catalog product, always include its price and link to its specific product page using markdown link format: [Product Name](/product/ID) so the system can render its visual preview card.
- Use occasional emojis (💎✨💍) but sparingly and elegantly`;

    if (!process.env.OPENAI_API_KEY) {
      // Fallback response with catalog-aware suggestions
      return NextResponse.json({
        message: getFallbackResponse(messages[messages.length - 1]?.content || "", dbProducts),
      });
    }

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        ...messages.slice(-10),
      ],
      max_tokens: 300,
      temperature: 0.7,
    });

    const message = response.choices[0]?.message?.content || "I'm sorry, I couldn't process that. Please try again.";

    return NextResponse.json({ message });
  } catch (error) {
    console.error("Chat API error:", error);
    const lastMessage = (await req.clone().json().catch(() => ({ messages: [] }))).messages?.slice(-1)[0]?.content || "";
    return NextResponse.json({
      message: getFallbackResponse(lastMessage, []),
    });
  }
}

function getFallbackResponse(userMessage: string, dbProducts: any[]): string {
  const msg = userMessage.toLowerCase();

  const getProductSug = (cat: string) => {
    const matched = dbProducts.find((p) => p.category?.toLowerCase() === cat.toLowerCase());
    if (matched) {
      return `Our top recommendation is the [${matched.name}](/product/${matched.id}) for Rs. ${matched.price.toLocaleString()}.`;
    }
    return "";
  };

  if (msg.includes("hello") || msg.includes("hi") || msg.includes("hey") || msg === "") {
    return "Hello, beautiful! 💎 I'm Lexa, your personal Luxella stylist. Whether you're looking for a statement necklace, elegant earrings, or the perfect gift — I'm here to help. What are you looking for today?";
  }
  if (msg.includes("necklace")) {
    const sug = getProductSug("Necklaces");
    return `Our necklaces are crafted to perfection ✨ From delicate chains to bold statement pieces, we have something for every style. ${sug} Visit /shop?category=Necklaces to explore. Would you like help finding something for a specific occasion?`;
  }
  if (msg.includes("earring")) {
    const sug = getProductSug("Earrings");
    return `Our earring collection is simply stunning 💍 We carry studs, drops, hoops, and chandeliers — all hypoallergenic and beautifully crafted. ${sug} Browse them at /shop?category=Earrings. Any particular style in mind?`;
  }
  if (msg.includes("ring")) {
    const sug = getProductSug("Rings");
    return `Our rings range from minimalist bands to dazzling statement pieces ✨ All feature premium zirconia stones and durable gold/silver plating. ${sug} Check them out at /shop?category=Rings!`;
  }
  if (msg.includes("bracelet")) {
    const sug = getProductSug("Bracelets");
    return `Our bracelets are the perfect finishing touch 💎 From delicate chains to bold cuffs, each piece is crafted to elevate any outfit. ${sug} Explore at /shop?category=Bracelets. Can I help you find a specific style?`;
  }
  if (msg.includes("price") || msg.includes("cost") || msg.includes("how much") || msg.includes("budget")) {
    return "Luxella offers affordable luxury — our pieces are priced to give you the look and feel of fine jewelry without breaking the bank. Visit our /shop page to see the full range. Is there a specific budget I can help you work within?";
  }
  if (msg.includes("shipping") || msg.includes("delivery") || msg.includes("deliver")) {
    return "We ship across all of Pakistan! 📦 Delivery takes 3–5 business days after order confirmation. All orders are carefully packaged to ensure your jewelry arrives in perfect condition.";
  }
  if (msg.includes("return") || msg.includes("exchange") || msg.includes("refund")) {
    return "We offer hassle-free returns and exchanges 💎 If you're not completely satisfied, email us at osamaafzal1432901@gmail.com or call +92 349 5804586. We want you to love your Luxella piece!";
  }
  if (msg.includes("material") || msg.includes("quality") || msg.includes("allerg") || msg.includes("skin")) {
    return "All Luxella jewelry uses hypoallergenic metals, making them safe for sensitive skin ✨ We use premium zirconia stones and high-quality gold and silver plating that maintains its shine beautifully.";
  }
  if (msg.includes("gift") || msg.includes("present") || msg.includes("birthday") || msg.includes("wedding")) {
    return "Luxella jewelry makes the most thoughtful gift! 💍 For weddings, our necklace and earring sets are stunning. For birthdays, a personalized ring or bracelet is always special. Would you like help picking the perfect piece?";
  }
  if (msg.includes("contact") || msg.includes("support") || msg.includes("help") || msg.includes("phone") || msg.includes("location") || msg.includes("address") || msg.includes("where")) {
    return "Our team is ready to help! 💎 Visit our showroom at Factory No 51, Model Town, Islamabad. Email us at osamaafzal1432901@gmail.com or WhatsApp/Call +92 349 5804586. Open Mon–Sat, 10AM–8PM.";
  }
  if (msg.includes("care") || msg.includes("clean") || msg.includes("maintain")) {
    return "To keep your Luxella jewelry radiant ✨ avoid contact with water, perfume, and chemicals. Store in a soft pouch or box when not wearing. Wipe gently with a soft dry cloth to restore shine. Is there anything else I can help with?";
  }

  return "That's a wonderful question! 💎 For the most accurate information, I'd recommend visiting our /shop page or contacting our team at osamaafzal1432901@gmail.com. Is there something specific about our jewelry collection I can help you with?";
}

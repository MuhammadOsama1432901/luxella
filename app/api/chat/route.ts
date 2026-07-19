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

    // Strict validation for OpenAI key. If it's the template placeholder or empty, immediately use smart fallback
    const hasRealKey =
      process.env.OPENAI_API_KEY &&
      process.env.OPENAI_API_KEY !== "dummy-key-for-build" &&
      !process.env.OPENAI_API_KEY.includes("your-openai-key");

    if (!hasRealKey) {
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
    const dbProducts = await getProducts().catch(() => []);
    return NextResponse.json({
      message: getFallbackResponse(lastMessage, dbProducts),
    });
  }
}

function getFallbackResponse(userMessage: string, dbProducts: any[]): string {
  const msg = userMessage.toLowerCase().trim();

  const getProductSug = (cat: string) => {
    const matched = dbProducts.find((p) => p.category?.toLowerCase() === cat.toLowerCase());
    if (matched) {
      return `Our top recommendation is the [${matched.name}](/product/${matched.id}) for Rs. ${matched.price.toLocaleString()}.`;
    }
    return "";
  };

  // 1. Urdu / Roman Urdu / English Greetings & How are you
  const isUrduGreeting =
    msg.includes("کیسے") ||
    msg.includes("حال") ||
    msg.includes("سلام") ||
    msg.includes("علیکم") ||
    msg.includes("خیریت");

  const isRomanUrduGreeting =
    msg.includes("kaise ho") ||
    msg.includes("kese ho") ||
    msg.includes("kese hain") ||
    msg.includes("kaise hain") ||
    msg.includes("kya haal") ||
    msg.includes("kia haal") ||
    msg.includes("kia hal") ||
    msg.includes("kya hal") ||
    msg.includes("kese ho lexa") ||
    msg.includes("kaise ho lexa") ||
    msg.includes("kya chal raha");

  const isStandardGreeting =
    msg.includes("hello") ||
    msg.includes("hi") ||
    msg.includes("hey") ||
    msg.includes("salam") ||
    msg.includes("assalam") ||
    msg.includes("aoa") ||
    msg === "";

  if (isUrduGreeting) {
    return "وعلیکم السلام! 💎 میں بالکل ٹھیک ہوں، الحمدللہ۔ آپ سنائیں آپ کیسی ہیں؟ میں لیکسا ہوں، آپ کی پرسنل جیولری اسٹائلسٹ۔ کیا میں آپ کو کوئی خوبصورت ہار، انگوٹھی یا جھمکے دکھاؤں؟";
  }

  if (isRomanUrduGreeting) {
    return "Main bilkul theek hoon, Alhamdulillah! 💎 Aap bataiye aap kaisi hain? I'm Lexa, your personal Luxella AI stylist. Kya main aapke liye koi specific jewelry set, ring ya earrings recommend karoon? ✨";
  }

  if (isStandardGreeting) {
    return "Hello, beautiful! 💎 I'm Lexa, your personal Luxella stylist. Whether you're looking for a statement necklace, elegant earrings, or the perfect anniversary gift — I'm here to help. What style can I find for you today?";
  }

  // 2. Necklaces
  if (msg.includes("necklace") || msg.includes("haar") || msg.includes("gale ka") || msg.includes("set")) {
    const sug = getProductSug("Necklaces");
    return `Our necklaces are crafted to perfection ✨ From delicate gold chains to bold bridal sets, we carry stunning pieces. ${sug} Visit /shop?category=Necklaces to explore. Would you like help finding a specific set?`;
  }

  // 3. Earrings
  if (msg.includes("earring") || msg.includes("jhumk") || msg.includes("baali") || msg.includes("tops")) {
    const sug = getProductSug("Earrings");
    return `Our earring collection is simply stunning 💍 Studs, drop earrings, and luxury hoops — all hypoallergenic. ${sug} Browse them at /shop?category=Earrings. Any particular design in mind?`;
  }

  // 4. Rings
  if (msg.includes("ring") || msg.includes("angothi") || msg.includes("chhalla")) {
    const sug = getProductSug("Rings");
    return `Our rings range from minimalist gold bands to premium zirconia statement pieces ✨ ${sug} Check them out at /shop?category=Rings!`;
  }

  // 5. Bracelets
  if (msg.includes("bracelet") || msg.includes("kangan") || msg.includes("kara") || msg.includes("churi")) {
    const sug = getProductSug("Bracelets");
    return `Our bracelets are the perfect finishing touch 💎 Elegant chains and structured gold plating. ${sug} Explore at /shop?category=Bracelets.`;
  }

  // 6. Pricing & Cost
  if (
    msg.includes("price") ||
    msg.includes("cost") ||
    msg.includes("how much") ||
    msg.includes("budget") ||
    msg.includes("kitne ka") ||
    msg.includes("kitne ki") ||
    msg.includes("kitnay ka") ||
    msg.includes("paisa") ||
    msg.includes("rate")
  ) {
    return "Luxella offers affordable luxury! 💎 Direct product cards show our live prices (ranging from Rs. 1,500 to Rs. 4,500). Visit our /shop page to see the full collection. Is there a specific budget you're working within?";
  }

  // 7. Shipping / Delivery
  if (
    msg.includes("shipping") ||
    msg.includes("delivery") ||
    msg.includes("deliver") ||
    msg.includes("kab milega") ||
    msg.includes("kab tak") ||
    msg.includes("din lagein")
  ) {
    return "We ship all across Pakistan! 📦 Delivery takes 3–5 business days after order confirmation. All orders are carefully packed in our luxury boxes to ensure perfect condition.";
  }

  // 8. Returns / Exchange
  if (
    msg.includes("return") ||
    msg.includes("exchange") ||
    msg.includes("refund") ||
    msg.includes("wapis") ||
    msg.includes("badalna")
  ) {
    return "We offer hassle-free returns and exchanges within 7 days 💎 If you're not satisfied, email us at osamaafzal1432901@gmail.com or WhatsApp +92 349 5804586. We want you to love your Luxella pieces!";
  }

  // 9. Materials & Care
  if (
    msg.includes("material") ||
    msg.includes("quality") ||
    msg.includes("allerg") ||
    msg.includes("skin") ||
    msg.includes("metal") ||
    msg.includes("asli") ||
    msg.includes("kharab")
  ) {
    return "All Luxella jewelry uses hypoallergenic metals, making them 100% safe for sensitive skin ✨ We use high-grade zirconia stones and premium gold/silver plating. To maintain shine, avoid contact with perfume/water.";
  }

  // 10. Gift Studio
  if (
    msg.includes("gift") ||
    msg.includes("present") ||
    msg.includes("birthday") ||
    msg.includes("wedding") ||
    msg.includes("tuhfa")
  ) {
    return "Luxella jewelry makes a beautiful gift! 🎁 We offer luxury curated sets and signature gift box upgrades (+ Rs. 499) at checkout. Would you like me to help you choose the perfect item?";
  }

  // 11. Showroom & Address
  if (
    msg.includes("contact") ||
    msg.includes("support") ||
    msg.includes("help") ||
    msg.includes("phone") ||
    msg.includes("location") ||
    msg.includes("address") ||
    msg.includes("showroom") ||
    msg.includes("office") ||
    msg.includes("kahan hai")
  ) {
    return "You are always welcome! 💎 Visit our showroom at Factory No 51, Model Town, Islamabad. Open Mon–Sat, 10AM–8PM. Support Email: osamaafzal1432901@gmail.com | WhatsApp/Call: +92 349 5804586.";
  }

  // 12. General fallback
  return "That is a wonderful question! 💎 For the most detailed styling assistance, visit our /shop page or connect with our support team on WhatsApp at +92 349 5804586. Is there a specific type of jewelry I can help you search for?";
}

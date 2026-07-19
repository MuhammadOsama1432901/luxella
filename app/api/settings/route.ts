import { NextResponse } from "next/server";
import { getSettings } from "@/lib/db";

export async function GET() {
  try {
    const settings = await getSettings();
    
    // Safely structure settings to NEVER expose private API/Secret keys to the client
    return NextResponse.json({
      storeName: settings.storeName || "Luxella",
      phone: settings.phone || "+92 349 5804586",
      email: settings.email || "hello@luxella.pk",
      address: settings.address || "Lahore, Pakistan",
      currency: settings.currency || "PKR",
      taxRate: settings.taxRate || 0,
      maintenanceMode: settings.maintenanceMode || false,
      logo: settings.logo || "/images/logo/logo-crest.jpg",
      favicon: settings.favicon || "/favicon.ico",
      shippingZones: settings.shippingZones || [],
      stripeEnabled: !!settings.paymentKeys?.stripe,
      easyPaisaEnabled: !!settings.paymentKeys?.easyPaisa,
      easyPaisaMerchantId: settings.paymentKeys?.easyPaisa || "",
    });
  } catch (err) {
    console.error("GET public settings error:", err);
    return NextResponse.json({
      storeName: "Luxella",
      phone: "+92 349 5804586",
      email: "hello@luxella.pk",
      address: "Lahore, Pakistan",
      currency: "PKR",
      taxRate: 0,
      shippingZones: [],
      stripeEnabled: false,
      easyPaisaEnabled: false,
    });
  }
}

// Centralized config — single source of truth for business info
export const BUSINESS_PHONE = "923495804586";
export const BUSINESS_PHONE_DISPLAY = "+92 349 5804586";

export const BANK_DETAILS = {
  bankName: "Bank Alfalah",
  accountTitle: "Luxella Jewelry",
  accountNumber: "0192-100582049",
  iban: "PK15ALFA0192100582049",
};

export const FREE_DELIVERY_THRESHOLD = 3000; // PKR
export const RETURN_POLICY_DAYS = 7;
export const SUPPORT_HOURS = "Mon–Sat, 10AM–8PM";

export const WHATSAPP_API = (phone: string, message: string) =>
  `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(message)}`;

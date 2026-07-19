import fs from "fs/promises";
import path from "path";
import { Product } from "@/types/product";

// Extend the Product interface in our database type to support specs and advanced variables
export interface DBProduct extends Product {
  description: string;
  stock: number;
  featured: boolean;
  specifications: Record<string, string>;
  
  // Advanced features
  sku?: string;
  barcode?: string;
  costPrice?: number;
  salePrice?: number;
  tax?: number;
  slug?: string;
  subcategory?: string;
  weight?: string;
  dimensions?: string;
  variants?: { size?: string[]; color?: string[] };
  virtualTryOn?: boolean;
  images?: string[];
  videoUrl?: string;
  image360?: string[];
  tags?: string[];
  visibility?: "visible" | "hidden" | "archived";
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
  relatedProducts?: number[];
  boughtTogether?: number[];
  warehouseStock?: Record<string, number>;
}

export interface CustomerDetails {
  name: string;
  phone: string;
  email: string;
  address: string;
  city: string;
}

export interface OrderItem {
  productId: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface OrderTimelineEvent {
  status: string;
  timestamp: string;
  note?: string;
}

export interface Order {
  id: string;
  customer: CustomerDetails;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  paymentMethod: string;
  status: "pending" | "confirmed" | "packed" | "ready_to_ship" | "shipped" | "delivered" | "cancelled" | "refund_requested" | "refund_approved" | "returned" | "exchange";
  trackingNumber?: string;
  createdAt: string;
  
  // Advanced Order variables
  timeline?: OrderTimelineEvent[];
  adminNotes?: string;
  customerNotes?: string;
}

export interface DBUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  passwordHash: string;
  role: "super_admin" | "admin" | "manager" | "inventory" | "support" | "marketing" | "customer";
  createdAt: string;
  permissions?: string[];
  loginHistory?: { ip?: string; timestamp: string }[];
  resetToken?: string;
  resetTokenExpiry?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  banner?: string;
  image?: string;
  icon?: string;
  seoTitle?: string;
  seoDescription?: string;
  displayOrder: number;
  featured: boolean;
  subcategories?: string[];
}

export interface Review {
  id: string;
  productId: number;
  productName: string;
  customerName: string;
  customerEmail: string;
  rating: number;
  comment: string;
  status: "pending" | "approved" | "rejected";
  reply?: string;
  images?: string[];
  videoUrl?: string;
  verifiedBuyer: boolean;
  createdAt: string;
}

export interface Coupon {
  id: string;
  code: string;
  type: "percentage" | "fixed" | "free_shipping" | "buy_x_get_y";
  value: number;
  buyQty?: number;
  getQty?: number;
  minSpend?: number;
  startDate: string;
  endDate: string;
  usageLimit?: number;
  usageCount: number;
  active: boolean;
}

export interface GiftSetting {
  id: string;
  name: string;
  price: number;
  type: "wrapping" | "box" | "card" | "accessory";
  image?: string;
  description?: string;
}

export interface BannerSetting {
  id: string;
  type: "hero" | "promo" | "category" | "announcement" | "popup";
  title: string;
  subtitle?: string;
  image?: string;
  link?: string;
  active: boolean;
}

export interface CMSPage {
  slug: string;
  title: string;
  content: string;
  lastUpdated: string;
}

export interface WebsiteSetting {
  storeName: string;
  phone: string;
  email: string;
  address: string;
  currency: string;
  taxRate: number;
  maintenanceMode: boolean;
  logo?: string;
  favicon?: string;
  socialLinks?: Record<string, string>;
  paymentKeys?: Record<string, string>;
  shippingZones?: { id: string; name: string; rate: number; minDays: number; maxDays: number }[];
}

export interface SystemLog {
  id: string;
  userId?: string;
  userName?: string;
  action: string;
  details: string;
  timestamp: string;
  ip?: string;
}

interface DBStructure {
  products: DBProduct[];
  orders: Order[];
  users: DBUser[];
  categories: Category[];
  reviews: Review[];
  coupons: Coupon[];
  gifts: GiftSetting[];
  banners: BannerSetting[];
  cms: CMSPage[];
  settings: WebsiteSetting;
  logs: SystemLog[];
  customerMeta?: Record<string, { isVip?: boolean; isBlocked?: boolean }>;
  subscribers?: { email: string; subscribedAt: string }[];
}

const DB_PATH = process.env.VERCEL === "1"
  ? path.join("/tmp", "db.json")
  : path.join(process.cwd(), "data", "db.json");

const initialProducts: DBProduct[] = [
  {
    id: 1,
    name: "Luxury Gold Necklace",
    image: "/images/products/product1.jpg",
    price: 2499,
    oldPrice: 3499,
    rating: 5,
    sale: true,
    category: "Necklaces",
    description: "Indulge in the luxury of this 24K gold plated necklace featuring an intricate diamond-cut crystal pendant. Perfect for formal events and bridal wear, this piece radiates timeless beauty.",
    stock: 10,
    featured: true,
    specifications: {
      "Material": "24K Gold Plating",
      "Stone": "Cubic Zirconia",
      "Clasp Type": "Lobster Claw",
      "Chain Length": "18 inches"
    }
  },
  {
    id: 2,
    name: "Elegant Earrings",
    image: "/images/products/product2.jpg",
    price: 1499,
    oldPrice: 1999,
    rating: 4,
    sale: true,
    category: "Earrings",
    description: "Make a statement with these breathtaking gold dangling earrings, adorned with premium synthetic emerald gemstones. Designed with a secure push-back closure, they offer both class and comfort.",
    stock: 15,
    featured: true,
    specifications: {
      "Material": "18K Gold Plated Alloy",
      "Stone": "Synthetic Emerald",
      "Weight": "12g (pair)",
      "Closure": "Push Back"
    }
  },
  {
    id: 3,
    name: "Diamond Ring",
    image: "/images/products/product3.jpg",
    price: 1999,
    oldPrice: 2599,
    rating: 5,
    sale: false,
    category: "Rings",
    description: "A classic symbol of sophistication. This sterling silver ring is crowned with a brilliant-cut central diamond stimulant that sparkles intensely from every angle.",
    stock: 5,
    featured: true,
    specifications: {
      "Material": "Sterling Silver 925",
      "Stone": "Brilliant-Cut Zirconia",
      "Ring Size": "Adjustable",
      "Band Width": "2mm"
    }
  },
  {
    id: 4,
    name: "Pearl Bracelet",
    image: "/images/products/product4.jpg",
    price: 1299,
    oldPrice: 1799,
    rating: 4,
    sale: true,
    category: "Bracelets",
    description: "Wrap your wrist in elegance with this freshwater pearl bracelet. Threaded on durable elastic and finished with a gold-plated clasp, it is a versatile accessory for any outfit.",
    stock: 8,
    featured: true,
    specifications: {
      "Material": "Freshwater Pearls, Gold Clasp",
      "Pearl Size": "8mm",
      "Length": "7 inches",
      "Style": "Classic Beaded"
    }
  },
  {
    id: 5,
    name: "Royal Bridal Set",
    image: "/images/categories/bridal.jpg",
    price: 12500,
    oldPrice: 15000,
    rating: 5,
    sale: true,
    category: "Bridal",
    description: "A majestic bridal jewelry set including a heavy collar necklace and matching dangle earrings, meticulously encrusted with high-grade Kundan stones and drop pearls.",
    stock: 3,
    featured: true,
    specifications: {
      "Material": "Gold Plated Brass, Kundan Work",
      "Stones": "Kundan & Faux Pearls",
      "Includes": "Necklace + Pair of Earrings",
      "Weight": "150g"
    }
  },
  {
    id: 6,
    name: "Modern Silver Hoops",
    image: "/images/categories/new.jpg",
    price: 999,
    oldPrice: 1499,
    rating: 4,
    sale: false,
    category: "New Arrival",
    description: "Elevate your casual attire with these contemporary sterling silver hoop earrings. Sleek, lightweight, and finished with a high-polish sheen.",
    stock: 20,
    featured: false,
    specifications: {
      "Material": "Sterling Silver 925",
      "Diameter": "30mm",
      "Weight": "5g per hoop",
      "Closure": "Hinge"
    }
  }
];

async function ensureDir(dirPath: string) {
  try {
    await fs.mkdir(dirPath, { recursive: true });
  } catch (err) {
    // Ignore if directory exists
  }
}

const defaultSettings: WebsiteSetting = {
  storeName: "Luxella",
  phone: "+92-300-0000000",
  email: "hello@luxella.pk",
  address: "Lahore, Pakistan",
  currency: "PKR",
  taxRate: 16,
  maintenanceMode: false,
  logo: "/images/logo/logo-crest.jpg",
  favicon: "/favicon.ico",
  socialLinks: { instagram: "", facebook: "", tiktok: "" },
  paymentKeys: { stripe: "", easyPaisa: "", jazzCash: "" },
  shippingZones: [
    { id: "1", name: "Local Delivery", rate: 200, minDays: 1, maxDays: 3 },
    { id: "2", name: "National Delivery", rate: 350, minDays: 3, maxDays: 6 }
  ]
};

export async function readDB(): Promise<DBStructure> {
  try {
    await ensureDir(path.dirname(DB_PATH));
    
    // Copy initial database to writable /tmp on Vercel if it does not exist yet
    if (process.env.VERCEL === "1") {
      try {
        await fs.access(DB_PATH);
      } catch {
        const repoDbPath = path.join(process.cwd(), "data", "db.json");
        const repoData = await fs.readFile(repoDbPath, "utf-8");
        await fs.writeFile(DB_PATH, repoData, "utf-8");
      }
    }

    const data = await fs.readFile(DB_PATH, "utf-8");
    const parsed = JSON.parse(data);
    
    // Ensure all collections exist in parsing to avoid crashes
    if (!parsed.users) parsed.users = [];
    if (!parsed.categories) parsed.categories = [];
    if (!parsed.reviews) parsed.reviews = [];
    if (!parsed.coupons) parsed.coupons = [];
    if (!parsed.gifts) parsed.gifts = [];
    if (!parsed.banners) parsed.banners = [];
    if (!parsed.cms) parsed.cms = [];
    if (!parsed.settings) parsed.settings = defaultSettings;
    if (!parsed.logs) parsed.logs = [];
    
    return parsed;
  } catch (error) {
    // If file doesn't exist, create it with initial default structures
    const initialDB: DBStructure = {
      products: initialProducts,
      orders: [],
      users: [],
      categories: [
        { id: "1", name: "Necklaces", slug: "necklaces", displayOrder: 1, featured: true },
        { id: "2", name: "Earrings", slug: "earrings", displayOrder: 2, featured: true },
        { id: "3", name: "Rings", slug: "rings", displayOrder: 3, featured: true },
        { id: "4", name: "Bracelets", slug: "bracelets", displayOrder: 4, featured: true }
      ],
      reviews: [],
      coupons: [],
      gifts: [
        { id: "1", name: "Premium Gift Wrapping", price: 250, type: "wrapping", description: "Hand-wrapped in luxury paper with a ribbon." },
        { id: "2", name: "Luxury Gift Box", price: 500, type: "box", description: "A velvet-lined drawer style premium box." }
      ],
      banners: [],
      cms: [],
      settings: defaultSettings,
      logs: []
    };
    await writeDB(initialDB);
    return initialDB;
  }
}

export async function writeDB(data: DBStructure): Promise<void> {
  await ensureDir(path.dirname(DB_PATH));
  await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2), "utf-8");
}

export async function getProducts(): Promise<DBProduct[]> {
  const db = await readDB();
  return db.products;
}

export async function getProductById(id: number): Promise<DBProduct | null> {
  const db = await readDB();
  const product = db.products.find((p) => p.id === id);
  return product || null;
}

export async function createProduct(productData: Omit<DBProduct, "id">): Promise<DBProduct> {
  const db = await readDB();
  const nextId = db.products.length > 0 ? Math.max(...db.products.map((p) => p.id)) + 1 : 1;
  const newProduct: DBProduct = {
    ...productData,
    id: nextId,
  };
  db.products.push(newProduct);
  await writeDB(db);
  return newProduct;
}

export async function updateProduct(id: number, productData: Partial<DBProduct>): Promise<DBProduct | null> {
  const db = await readDB();
  const index = db.products.findIndex((p) => p.id === id);
  if (index === -1) return null;

  db.products[index] = {
    ...db.products[index],
    ...productData,
    id, // ensure ID cannot be changed
  };

  await writeDB(db);
  return db.products[index];
}

export async function deleteProduct(id: number): Promise<boolean> {
  const db = await readDB();
  const filtered = db.products.filter((p) => p.id !== id);
  if (filtered.length === db.products.length) return false;
  db.products = filtered;
  await writeDB(db);
  return true;
}

export async function getOrders(): Promise<Order[]> {
  const db = await readDB();
  return db.orders;
}

export async function createOrder(orderData: Omit<Order, "id" | "createdAt" | "status">): Promise<Order> {
  const db = await readDB();
  
  // Deduct stock for each item in the order
  for (const item of orderData.items) {
    const productIndex = db.products.findIndex((p) => p.id === item.productId);
    if (productIndex !== -1) {
      const currentStock = db.products[productIndex].stock ?? 0;
      db.products[productIndex].stock = Math.max(0, currentStock - item.quantity);
    }
  }

  const nextOrderNum = db.orders.length + 1001; // Start order numbers from 1001
  const orderId = `LXL-${new Date().getFullYear()}-${nextOrderNum}`;

  const newOrder: Order = {
    ...orderData,
    id: orderId,
    status: "pending",
    createdAt: new Date().toISOString(),
  };

  db.orders.unshift(newOrder); // Add to the beginning of the list
  await writeDB(db);
  return newOrder;
}

export async function updateOrderStatus(
  id: string,
  status: Order["status"],
  trackingNumber?: string
): Promise<Order | null> {
  const db = await readDB();
  const index = db.orders.findIndex((o) => o.id === id);
  if (index === -1) return null;

  db.orders[index].status = status;
  if (trackingNumber !== undefined) {
    db.orders[index].trackingNumber = trackingNumber;
  }

  await writeDB(db);
  return db.orders[index];
}

// ── User CRUD ──────────────────────────────────────────────────────────────────
export async function getUsers(): Promise<DBUser[]> {
  const db = await readDB();
  return db.users;
}

export async function getUserByEmail(email: string): Promise<DBUser | null> {
  const db = await readDB();
  return db.users.find((u) => u.email.toLowerCase() === email.toLowerCase()) ?? null;
}

export async function getUserById(id: string): Promise<DBUser | null> {
  const db = await readDB();
  return db.users.find((u) => u.id === id) ?? null;
}

export async function createUser(data: Omit<DBUser, "id" | "createdAt">): Promise<DBUser> {
  const db = await readDB();
  const newUser: DBUser = {
    ...data,
    id: `usr_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    createdAt: new Date().toISOString(),
  };
  db.users.push(newUser);
  await writeDB(db);
  return newUser;
}

export async function updateUser(id: string, userData: Partial<DBUser>): Promise<DBUser | null> {
  const db = await readDB();
  const index = db.users.findIndex((u) => u.id === id);
  if (index === -1) return null;
  db.users[index] = { ...db.users[index], ...userData, id };
  await writeDB(db);
  return db.users[index];
}

// ── Categories CRUD ───────────────────────────────────────────────────────────
export async function getCategories(): Promise<Category[]> {
  const db = await readDB();
  return db.categories;
}
export async function saveCategories(categories: Category[]): Promise<void> {
  const db = await readDB();
  db.categories = categories;
  await writeDB(db);
}

// ── Reviews CRUD ──────────────────────────────────────────────────────────────
export async function getReviews(): Promise<Review[]> {
  const db = await readDB();
  return db.reviews;
}
export async function saveReviews(reviews: Review[]): Promise<void> {
  const db = await readDB();
  db.reviews = reviews;
  await writeDB(db);
}

// ── Coupons CRUD ──────────────────────────────────────────────────────────────
export async function getCoupons(): Promise<Coupon[]> {
  const db = await readDB();
  return db.coupons;
}
export async function saveCoupons(coupons: Coupon[]): Promise<void> {
  const db = await readDB();
  db.coupons = coupons;
  await writeDB(db);
}

// ── Gifts CRUD ────────────────────────────────────────────────────────────────
export async function getGifts(): Promise<GiftSetting[]> {
  const db = await readDB();
  return db.gifts;
}
export async function saveGifts(gifts: GiftSetting[]): Promise<void> {
  const db = await readDB();
  db.gifts = gifts;
  await writeDB(db);
}

// ── Banners CRUD ──────────────────────────────────────────────────────────────
export async function getBanners(): Promise<BannerSetting[]> {
  const db = await readDB();
  return db.banners;
}
export async function saveBanners(banners: BannerSetting[]): Promise<void> {
  const db = await readDB();
  db.banners = banners;
  await writeDB(db);
}

// ── CMS Page CRUD ──────────────────────────────────────────────────────────────
export async function getCmsPages(): Promise<CMSPage[]> {
  const db = await readDB();
  return db.cms;
}
export async function saveCmsPages(cms: CMSPage[]): Promise<void> {
  const db = await readDB();
  db.cms = cms;
  await writeDB(db);
}

// ── Website Settings CRUD ─────────────────────────────────────────────────────
export async function getSettings(): Promise<WebsiteSetting> {
  const db = await readDB();
  return db.settings;
}
export async function saveSettings(settings: WebsiteSetting): Promise<void> {
  const db = await readDB();
  db.settings = settings;
  await writeDB(db);
}

// ── System Logs ───────────────────────────────────────────────────────────────
export async function getSystemLogs(): Promise<SystemLog[]> {
  const db = await readDB();
  return db.logs;
}
export async function createSystemLog(userId: string | undefined, userName: string | undefined, action: string, details: string, ip?: string): Promise<SystemLog> {
  const db = await readDB();
  const log: SystemLog = {
    id: `log_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    userId,
    userName,
    action,
    details,
    timestamp: new Date().toISOString(),
    ip
  };
  db.logs.unshift(log); // newest first
  if (db.logs.length > 500) {
    db.logs = db.logs.slice(0, 500); // cap at 500 logs
  }
  await writeDB(db);
  return log;
}



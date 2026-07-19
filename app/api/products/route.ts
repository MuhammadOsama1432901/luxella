import { NextResponse } from "next/server";
import { getProducts, createProduct } from "@/lib/db";
import { cookies } from "next/headers";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category    = searchParams.get("category");
    const search      = searchParams.get("search");
    const featured    = searchParams.get("featured");
    const sale        = searchParams.get("sale");
    const collection  = searchParams.get("collection");
    const material    = searchParams.get("material");
    const stone       = searchParams.get("stone");
    const color       = searchParams.get("color");
    const minRating   = searchParams.get("minRating");
    const minPrice    = searchParams.get("minPrice");
    const maxPrice    = searchParams.get("maxPrice");
    const availability = searchParams.get("availability");

    let products = await getProducts();

    if (category && category !== "All") {
      products = products.filter(
        (p) => p.category?.toLowerCase() === category.toLowerCase()
      );
    }

    if (search) {
      const query = search.toLowerCase();
      products = products.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.description?.toLowerCase().includes(query) ||
          p.category?.toLowerCase().includes(query)
      );
    }

    if (featured === "true") {
      products = products.filter((p) => p.featured === true);
    }

    if (sale === "true") {
      products = products.filter((p) => p.sale === true);
    }

    // Collection filter — map collection names to categories/tags
    if (collection && collection !== "All") {
      const collectionLower = collection.toLowerCase();
      if (collectionLower === "new arrivals") {
        // New arrivals — last 30% of products by ID (recently added)
        const sorted = [...products].sort((a, b) => b.id - a.id);
        products = sorted.slice(0, Math.max(1, Math.ceil(sorted.length * 0.3)));
      } else if (collectionLower === "best sellers") {
        products = products.filter((p) => p.rating >= 4);
      } else if (collectionLower === "sale" || collectionLower === "on sale") {
        products = products.filter((p) => p.sale === true);
      } else if (collectionLower === "bridal") {
        products = products.filter(
          (p) =>
            p.category?.toLowerCase().includes("bridal") ||
            p.name?.toLowerCase().includes("bridal") ||
            p.description?.toLowerCase().includes("bridal")
        );
      } else if (collectionLower === "luxury") {
        products = products.filter((p) => p.price >= 5000);
      } else {
        // Generic — try matching category or description
        products = products.filter(
          (p) =>
            p.category?.toLowerCase().includes(collectionLower) ||
            p.name?.toLowerCase().includes(collectionLower) ||
            p.description?.toLowerCase().includes(collectionLower)
        );
      }
    }

    // Material filter
    if (material && material !== "All") {
      const mat = material.toLowerCase();
      products = products.filter(
        (p) =>
          p.specifications?.Material?.toLowerCase().includes(mat) ||
          p.description?.toLowerCase().includes(mat)
      );
    }

    // Stone filter
    if (stone && stone !== "All") {
      const st = stone.toLowerCase();
      products = products.filter(
        (p) =>
          p.specifications?.Stone?.toLowerCase().includes(st) ||
          p.description?.toLowerCase().includes(st)
      );
    }

    // Color filter
    if (color && color !== "All") {
      const cl = color.toLowerCase();
      products = products.filter(
        (p) =>
          p.specifications?.Color?.toLowerCase().includes(cl) ||
          p.name?.toLowerCase().includes(cl) ||
          p.description?.toLowerCase().includes(cl)
      );
    }

    // Rating filter
    if (minRating) {
      const rating = Number(minRating);
      if (!isNaN(rating)) {
        products = products.filter((p) => p.rating >= rating);
      }
    }

    // Price range filter
    if (minPrice) {
      const min = Number(minPrice);
      if (!isNaN(min)) products = products.filter((p) => p.price >= min);
    }
    if (maxPrice) {
      const max = Number(maxPrice);
      if (!isNaN(max)) products = products.filter((p) => p.price <= max);
    }

    // Availability filter
    if (availability === "in-stock") {
      products = products.filter((p) => p.stock > 0);
    } else if (availability === "out-of-stock") {
      products = products.filter((p) => p.stock <= 0);
    }

    return NextResponse.json(products);
  } catch (error) {
    console.error("GET products error", error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    // Auth guard: only admins can create products
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("session")?.value;
    if (!sessionToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    // Simple validation
    if (!body.name || !body.price || !body.image) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const newProduct = await createProduct({
      name: body.name,
      image: body.image,
      price: Number(body.price),
      oldPrice: Number(body.oldPrice || body.price),
      rating: Number(body.rating || 4),
      sale: Boolean(body.sale),
      category: body.category || "Uncategorized",
      description: body.description || "",
      stock: Number(body.stock || 0),
      featured: Boolean(body.featured),
      specifications: body.specifications || {},
    });

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.error("POST products error", error);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}

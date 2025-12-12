import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authAdmin } from '@/lib/auth/admin';
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  // Check admin authentication
  const isAdmin = await authAdmin()
  if (!isAdmin) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  try {
    const formData = await req.formData();

    const name = formData.get("name") as string;
    const priceStr = formData.get("price") as string;
    const description = formData.get("description") as string;
    const categoryId = formData.get("categoryId") as string;
    const stockStr = formData.get("stock") as string;

    const images = formData.getAll("images") as File[];

    // Validate required fields
    if (!name || !name.trim()) {
      return NextResponse.json(
        { error: "Product name is required" },
        { status: 400 }
      );
    }

    if (!priceStr || !priceStr.trim()) {
      return NextResponse.json(
        { error: "Price is required" },
        { status: 400 }
      );
    }

    if (!categoryId || !categoryId.trim()) {
      return NextResponse.json(
        { error: "Category is required" },
        { status: 400 }
      );
    }

    // Parse and validate price
    const priceFloat = parseFloat(priceStr);
    if (isNaN(priceFloat) || priceFloat < 0) {
      return NextResponse.json(
        { error: "Invalid price. Please enter a valid number." },
        { status: 400 }
      );
    }

    // Convert to cents (integer)
    const priceInCents = Math.round(priceFloat * 100);

    // Parse and validate stock
    const stock = stockStr ? parseInt(stockStr, 10) : 0;
    const stockValue = isNaN(stock) || stock < 0 ? 0 : stock;

    // --- Generate product slug ---
    const slug =
      name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Remove accents
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "") +
      "-" +
      Math.floor(Math.random() * 9999);

    // --- Create product record first ---
    const newProduct = await prisma.product.create({
      data: {
        name: name.trim(),
        slug,
        price: priceInCents, // stored in cents
        description: description?.trim() || null,
        categoryId: categoryId.trim(),
        stock: stockValue,
        isPublished: true, // Auto-publish new products
      },
    });

    // --- Create upload folder if needed ---
    const uploadDir = path.join(process.cwd(), "public/uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // --- Save images ---
    let order = 0;

    for (const img of images) {
      const arrayBuffer = await img.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const filename = uuidv4() + "-" + img.name.replace(/\s+/g, "-");
      const filePath = path.join(uploadDir, filename);

      fs.writeFileSync(filePath, buffer);

      // Save image in Prisma
      await prisma.productImage.create({
        data: {
          productId: newProduct.id,
          url: "/uploads/" + filename,
          order: order++,
        },
      });
    }

    return NextResponse.json(
      { message: "Product created", productId: newProduct.id },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("❌ Error creating product:", error);
    
    // Return a proper error message
    const errorMessage = error?.message || "Server error";
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}



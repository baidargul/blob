import prisma from "@/lib/prisma";
import { Formatter } from "@/serverActions/internal/partials/formatters";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const response = {
    status: 500,
    message: "Internal Server Error",
    data: null as any,
  };

  try {
    const { searchParams } = new URL(req.url);
    const name = searchParams.get("name") || "";

    if (!name) {
      response.status = 400;
      response.message = "Name is required";
      return new Response(JSON.stringify(response));
    }

    const items = await prisma.product.findMany({
      where: {
        name: {
          contains: name,
          mode: "insensitive",
        },
      },
      include: {
        barcodeRegister: {
          include: {
            inventory: true,
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    });

    if (!items) {
      response.status = 404;
      response.message = "No products found";
      return new Response(JSON.stringify(response));
    }

    let products = [];

    for (const item of items) {
      if (item.barcodeRegister.length > 0) {
        for (const barcode of item.barcodeRegister) {
          const product = await Formatter.getProduct(
            barcode.productId,
            barcode.barcode || ""
          );
          products.push(product);
        }
      } else {
        const product = await Formatter.getProduct(item.id, "");
        products.push(product);
      }
    }

    response.status = 200;
    response.message = `Found ${products.length} products`;
    response.data = products;
    return new Response(JSON.stringify(response));
  } catch (error: any) {
    console.log("[SERVER ERROR]: " + error.message);
    response.status = 500;
    response.message = error.message;
    response.data = null;
    return new Response(JSON.stringify(response));
  }
}

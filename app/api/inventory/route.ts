import prisma from "@/lib/prisma";
import { Formatter } from "@/serverActions/internal/partials/formatters";
import { Product } from "@/serverActions/partials/product";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const response = {
    status: 500,
    message: "Internal Server Error",
    data: null as any,
  };

  try {
    const inventory = await prisma.inventory.findMany({
      include: {
        barcodeRegister: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    let products = [];
    if (!inventory) {
      response.status = 200;
      response.message = "Inventory is empty";
      response.data = null;
      return new Response(JSON.stringify(response));
    }

    for (const item of inventory) {
      const product = await Formatter.getProduct(
        item.barcodeRegister.productId,
        item.barcodeRegister.barcode || ""
      );

      if (product) {
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

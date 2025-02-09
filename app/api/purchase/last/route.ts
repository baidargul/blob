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
    const purchase = await prisma.purchase.findFirst({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        account: {
          include: {
            vendor: true,
            addresses: true,
          },
        },
        barcodeRegister: {
          include: {
            product: {
              include: {
                brand: true,
                category: true,
                type: true,
              },
            },
          },
        },
      },
    });

    let products = [];
    if (purchase) {
      for (const item of purchase.barcodeRegister) {
        const temp = await Formatter.getProduct(
          item.productId,
          item.barcode || ""
        );
        products.push(temp);
      }
    }

    if (!purchase) {
      response.status = 201;
      response.message = "No next purchase found";
      response.data = null;
      return new Response(JSON.stringify(response));
    }

    response.status = 200;
    response.message = "Purchase found successfully";
    response.data = { ...purchase, products: products };
    return new Response(JSON.stringify(response));
  } catch (error: any) {
    console.log("[SERVER ERROR]: " + error.message);
    response.status = 500;
    response.message = error.message;
    response.data = null;
    return new Response(JSON.stringify(response));
  }
}

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
    const sale = await prisma.sale.findFirst({
      orderBy: {
        createdAt: "asc",
      },
      include: {
        account: {
          include: {
            customer: true,
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
    if (sale) {
      for (const item of sale?.barcodeRegister) {
        const temp = await Formatter.getProduct(
          item.productId,
          item.barcode || ""
        );
        products.push(temp);
      }
    }

    response.status = 200;
    response.message = "sale found successfully";
    response.data = { ...sale, products: products };
    return new Response(JSON.stringify(response));
  } catch (error: any) {
    console.log("[SERVER ERROR]: " + error.message);
    response.status = 500;
    response.message = error.message;
    response.data = null;
    return new Response(JSON.stringify(response));
  }
}

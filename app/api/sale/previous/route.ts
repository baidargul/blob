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
    const id = searchParams.get("id");

    let sale: any = {};
    let previoussale: any = {};

    // If `id` is not provided, get the most recent sale
    if (!id) {
      sale = await prisma.sale.findFirst({
        orderBy: { createdAt: "desc" },
        include: {
          account: {
            include: {
              customer: true,
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
      previoussale = sale; // Set initial previous as current if no ID
    } else {
      // Retrieve specific sale if `id` is provided
      sale = await prisma.sale.findUnique({
        where: { id },
        include: {
          account: {
            include: {
              customer: true,
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

      // Only proceed if `sale` was successfully retrieved
      if (sale && sale.createdAt) {
        previoussale = await prisma.sale.findFirst({
          where: { createdAt: { lt: sale.createdAt } },
          orderBy: { createdAt: "desc" }, // To ensure fetching the immediate previous record
          include: {
            account: {
              include: {
                customer: true,
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
      }
    }

    // Format `products` from `barcodeRegister` if `previoussale` was found
    let products = [];
    if (previoussale && previoussale.barcodeRegister) {
      for (const item of previoussale.barcodeRegister) {
        try {
          const temp = await Formatter.getProduct(item.productId, item.barcode);
          products.push(temp);
        } catch (error: any) {
          console.error("Error formatting product:", error.message);
        }
      }
    }

    response.status = 200;
    response.message = "Previous sale found successfully";
    response.data = { ...previoussale, products };
    return new Response(JSON.stringify(response));
  } catch (error: any) {
    console.log("[SERVER ERROR]: " + error.message);
    response.status = 500;
    response.message = error.message;
    response.data = null;
    return new Response(JSON.stringify(response));
  }
}

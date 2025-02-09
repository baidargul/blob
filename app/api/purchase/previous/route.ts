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

    let purchase: any = {};
    let previousPurchase: any = {};

    // If `id` is not provided, get the most recent purchase
    if (!id) {
      purchase = await prisma.purchase.findFirst({
        orderBy: { createdAt: "desc" },
        include: {
          account: {
            include: {
              vendor: true,
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
      previousPurchase = purchase; // Set initial previous as current if no ID
    } else {
      // Retrieve specific purchase if `id` is provided
      purchase = await prisma.purchase.findUnique({
        where: { id },
        include: {
          account: {
            include: {
              vendor: true,
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

      // Only proceed if `purchase` was successfully retrieved
      if (purchase && purchase.createdAt) {
        previousPurchase = await prisma.purchase.findFirst({
          where: { createdAt: { lt: purchase.createdAt } },
          orderBy: { createdAt: "desc" }, // To ensure fetching the immediate previous record
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
      }
    }

    // Format `products` from `barcodeRegister` if `previousPurchase` was found
    let products = [];
    if (previousPurchase && previousPurchase.barcodeRegister) {
      for (const item of previousPurchase.barcodeRegister) {
        try {
          const temp = await Formatter.getProduct(item.productId, item.barcode);
          products.push(temp);
        } catch (error: any) {
          console.error("Error formatting product:", error.message);
        }
      }
    }

    if (!previousPurchase) {
      response.status = 201;
      response.message = "No previous purchase found";
      response.data = null;
      return new Response(JSON.stringify(response));
    }

    response.status = 200;
    response.message = "Previous purchase found successfully";
    response.data = { ...previousPurchase, products };
    return new Response(JSON.stringify(response));
  } catch (error: any) {
    console.log("[SERVER ERROR]: " + error.message);
    response.status = 500;
    response.message = error.message;
    response.data = null;
    return new Response(JSON.stringify(response));
  }
}

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

    if (!id) {
      response.status = 400;
      response.message = "ID is required";
      return new Response(JSON.stringify(response));
    }

    const purchase = await prisma.purchase.findUnique({
      where: {
        id: id,
      },
      include: {
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

    if (!purchase) {
      response.status = 400;
      response.message = "Purchase not found";
      return new Response(JSON.stringify(response));
    }

    const nextPurchase = await prisma.purchase.findFirst({
      where: {
        createdAt: {
          gt: purchase.createdAt || new Date(),
        },
      },
      orderBy: {
        createdAt: "asc",
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

    if (!nextPurchase) {
      response.status = 201;
      response.message = "No next purchase found";
      response.data = null;
      return new Response(JSON.stringify(response));
    }

    let products = [];
    if (nextPurchase) {
      for (const item of nextPurchase.barcodeRegister) {
        const temp = await Formatter.getProduct(
          item.productId,
          item.barcode || ""
        );
        products.push(temp);
      }
    }

    response.status = 200;
    response.message = "Next purchase found successfully";
    response.data = { ...nextPurchase, products: products };
    return new Response(JSON.stringify(response));
  } catch (error: any) {
    console.log("[SERVER ERROR]: " + error.message);
    response.status = 500;
    response.message = error.message;
    response.data = null;
    return new Response(JSON.stringify(response));
  }
}

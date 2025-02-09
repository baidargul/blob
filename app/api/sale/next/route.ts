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

    const sale = await prisma.sale.findUnique({
      where: {
        id: id,
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

    if (!sale) {
      response.status = 400;
      response.message = "sale not found";
      return new Response(JSON.stringify(response));
    }

    const nextsale = await prisma.sale.findFirst({
      where: {
        createdAt: {
          gt: sale.createdAt || new Date(),
        },
      },
      orderBy: {
        createdAt: "asc",
      },
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

    // if (!nextsale) {
    //   response.status = 200;
    //   response.message = "No next sale found";
    //   response.data = null;
    //   return new Response(JSON.stringify(response));
    // }

    let products = [];
    if (nextsale) {
      for (const item of nextsale.barcodeRegister) {
        const temp = await Formatter.getProduct(
          item.productId,
          item.barcode || ""
        );
        products.push(temp);
      }
    }

    response.status = 200;
    response.message = "Next sale found successfully";
    response.data = { ...nextsale, products: products };
    return new Response(JSON.stringify(response));
  } catch (error: any) {
    console.log("[SERVER ERROR]: " + error.message);
    response.status = 500;
    response.message = error.message;
    response.data = null;
    return new Response(JSON.stringify(response));
  }
}

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
    const barcode = searchParams.get("barcode") || "";

    if (!barcode) {
      response.status = 400;
      response.message = "Barcode is required";
      return new Response(JSON.stringify(response));
    }

    const product = await prisma.barcodeRegister.findUnique({
      where: {
        barcode: barcode,
      },
    });

    if (!product) {
      response.status = 404;
      response.message = "Product not registered";
      return new Response(JSON.stringify(response));
    }

    const formatted = await Formatter.getProduct(product.productId, barcode);

    response.status = 200;
    response.message = "Product found";
    response.data = formatted;
    return new Response(JSON.stringify(response));
  } catch (error: any) {
    console.log("[SERVER ERROR]: " + error.message);
    response.status = 500;
    response.message = error.message;
    response.data = null;
    return new Response(JSON.stringify(response));
  }
}

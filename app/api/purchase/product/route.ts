import prisma from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const response = {
    status: 500,
    message: "Internal Server Error",
    data: null as any,
  };

  try {
    const data = await req.json();

    if (!data.purchaseId) {
      response.status = 400;
      response.message = "Purchase Id is required";
      return new Response(JSON.stringify(response));
    }

    if (!data.productId) {
      response.status = 400;
      response.message = "Product Id is required";
      return new Response(JSON.stringify(response));
    }

    if (!data.barcode) {
      response.status = 400;
      response.message = "Barcode is required";
      return new Response(JSON.stringify(response));
    }

    const isExists = await prisma.barcodeRegister.findUnique({
      where: {
        barcode: data.barcode,
      },
    });

    if (isExists) {
      (response.status = 400), (response.message = "Barcode already exists");
      return new Response(JSON.stringify(response));
    }

    const purchase = await prisma.purchase.findUnique({
      where: {
        id: data.purchaseId,
      },
    });

    if (!purchase) {
      response.status = 400;
      response.message = "Purchase not found";
      return new Response(JSON.stringify(response));
    }

    const product = await prisma.product.findUnique({
      where: {
        id: data.productId,
      },
    });

    if (!product) {
      response.status = 400;
      response.message = "Product not found";
      return new Response(JSON.stringify(response));
    }

    let cost = 0;
    let invoice = 0;

    if (data.cost) {
      cost = data.cost;
    }

    if (data.invoice) {
      invoice = data.invoice;
    }

    const createdProduct = await prisma.barcodeRegister.create({
      data: {
        purchaseId: purchase.id,
        productId: product.id,
        color: data.color,
        cost: cost,
        invoice: invoice,
        barcode: data.barcode,
      },
    });

    if (!createdProduct) {
      response.status = 400;
      response.message = "Unable to create product";
      return new Response(JSON.stringify(response));
    }

    const finalProduct = await prisma.product.findUnique({
      where: {
        id: createdProduct.productId,
      },
      include: {
        barcodeRegister: {
          include: {
            purchase: true,
          },
        },
        category: true,
        brand: true,
        productImages: true,
        type: true,
      },
    });

    response.status = 200;
    response.message = "Product created successfully";
    response.data = finalProduct;
    return new Response(JSON.stringify(response));
  } catch (error: any) {
    console.log("[SERVER ERROR]: " + error.message);
    response.status = 500;
    response.message = error.message;
    response.data = null;
    return new Response(JSON.stringify(response));
  }
}

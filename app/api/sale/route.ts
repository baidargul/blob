import prisma from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const response = {
    status: 500,
    message: "Internal Server Error",
    data: null as any,
  };

  try {
    const sale = await prisma.sale.create({
      data: {
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    response.status = 200;
    response.message = "Sale created successfully";
    response.data = sale;
    return new Response(JSON.stringify(response));
  } catch (error: any) {
    console.log("[SERVER ERROR]: " + error.message);
    response.status = 500;
    response.message = error.message;
    response.data = null;
    return new Response(JSON.stringify(response));
  }
}

export async function PUT(req: NextRequest) {
  const response = {
    status: 500,
    message: "Internal Server Error",
    data: null as any,
  };

  try {
    const data = await req.json();

    if (!data.saleId) {
      response.status = 400;
      response.message = "Sale ID is required";
      response.data = null;
      return new Response(JSON.stringify(response));
    }

    if (!data.products || data.products.length === 0) {
      await prisma.sale.delete({
        where: {
          id: data.saleId,
        },
      });

      response.status = 200;
      response.message = "Sale scrapped as no products were added";
      response.data = null;
      return new Response(JSON.stringify(response));
    }

    if (!data.customerId) {
      response.status = 400;
      response.message = "Customer ID is required";
      response.data = null;
      return new Response(JSON.stringify(response));
    }

    let isExits: any = await prisma.sale.findUnique({
      where: {
        id: data.saleId,
      },
    });

    if (!isExits) {
      response.status = 404;
      response.message = "Sale not found";
      response.data = null;
      return new Response(JSON.stringify(response));
    }

    isExits = await prisma.customer.findUnique({
      where: {
        id: data.customerId,
      },
    });

    for (let i = 0; i < data.products.length; i++) {
      const product = data.products[i];
      isExits = await prisma.product.findUnique({
        where: {
          id: product.id,
        },
      });

      if (!isExits) {
        response.status = 404;
        response.message = `Product ${product.name} with barcode ${product.barcodeRegister[0].barcode} not found.`;
        response.data = null;
        return new Response(JSON.stringify(response));
      }
    }

    for (let i = 0; i < data.products.length; i++) {
      const product = data.products[i];
      isExits = await prisma.inventory.findFirst({
        where: {
          barcodeRegisterId: product.barcodeRegister[0].id,
        },
      });

      if (!isExits) {
        response.status = 404;
        response.message = `Product ${product.name} with barcode ${product.barcodeRegister[0].barcode} is out of stock.`;
        response.data = null;
        return new Response(JSON.stringify(response));
      }
    }

    for (let i = 0; i < data.products.length; i++) {
      const product: any = data.products[i];
      await prisma.barcodeRegister.update({
        where: {
          productId: product.id,
          barcode: product.barcodeRegister[0].barcode,
        },
        data: {
          saleId: data.saleId,
          soldAt: product.amount,
        },
      });

      await prisma.inventory.deleteMany({
        where: {
          barcodeRegisterId: product.barcodeRegister[0].id,
        },
      });

      console.log(
        `[INFO]: ${String(product.name).toLocaleUpperCase()}@Barcode ${
          product.barcodeRegister[0].barcode
        } sold`
      );
    }

    response.status = 200;
    response.message = "Sale saved successfully";
    response.data = null;
    return new Response(JSON.stringify(response));
  } catch (error: any) {
    console.log("[SERVER ERROR]: " + error.message);
    response.status = 500;
    response.message = error.message;
    response.data = null;
    return new Response(JSON.stringify(response));
  }
}

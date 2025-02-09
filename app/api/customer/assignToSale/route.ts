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

    if (!data.customer.id) {
      response.status = 400;
      response.message = "Customer ID is required";
      return new Response(JSON.stringify(response));
    }

    if (!data.saleId) {
      response.status = 400;
      response.message = "Sale ID is required";
      return new Response(JSON.stringify(response));
    }

    const sale = await prisma.sale.findUnique({
      where: {
        id: data.saleId,
      },
    });

    if (!sale) {
      response.status = 400;
      response.message = "Sale not found";
      return new Response(JSON.stringify(response));
    }

    const customer = await prisma.customer.findUnique({
      where: {
        id: data.customer.id,
      },
    });

    if (!customer) {
      response.status = 400;
      response.message = "customer not found";
      return new Response(JSON.stringify(response));
    }

    const updatedsale = await prisma.sale.update({
      where: {
        id: data.saleId,
      },
      data: {
        accountId: data.customer.accountId,
      },
      include: {
        account: {
          include: {
            addresses: true,
          },
        },
      },
    });

    response.status = 200;
    response.message = "customer assigned to sale successfully";
    response.data = updatedsale;
    return new Response(JSON.stringify(response));
  } catch (error: any) {
    console.log("[SERVER ERROR]: " + error.message);
    response.status = 500;
    response.message = error.message;
    response.data = null;
    return new Response(JSON.stringify(response));
  }
}

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

    if (!data.vendor.id) {
      response.status = 400;
      response.message = "Vendor is required";
      return new Response(JSON.stringify(response));
    }

    if (!data.purchaseId) {
      response.status = 400;
      response.message = "Purchase is required";
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

    const vendor = await prisma.vendor.findUnique({
      where: {
        id: data.vendor.id,
      },
    });

    if (!vendor) {
      response.status = 400;
      response.message = "Vendor not found";
      return new Response(JSON.stringify(response));
    }

    const updatedPurchase = await prisma.purchase.update({
      where: {
        id: data.purchaseId,
      },
      data: {
        accountId: data.vendor.accountId,
      },
    });

    response.status = 200;
    response.message = "Vendor assigned to purchase successfully";
    response.data = updatedPurchase;
    return new Response(JSON.stringify(response));
  } catch (error: any) {
    console.log("[SERVER ERROR]: " + error.message);
    response.status = 500;
    response.message = error.message;
    response.data = null;
    return new Response(JSON.stringify(response));
  }
}

import prisma from "@/lib/prisma";
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
    });

    if (!purchase) {
      response.status = 400;
      response.message = "Purchase not found";
      return new Response(JSON.stringify(response));
    }

    const previousPurchase = await prisma.purchase.findFirst({
      where: {
        createdAt: {
          lt: purchase.createdAt || new Date(),
        },
      },
    });

    response.status = 200;
    response.message = "Previous purchase found successfully";
    response.data = previousPurchase;
    return new Response(JSON.stringify(response));
  } catch (error: any) {
    console.log("[SERVER ERROR]: " + error.message);
    response.status = 500;
    response.message = error.message;
    response.data = null;
    return new Response(JSON.stringify(response));
  }
}

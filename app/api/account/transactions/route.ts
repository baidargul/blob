import prisma from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const response = {
    status: 500,
    message: "Internal Server Error",
    data: null as any,
  };

  try {
    const id = new URL(req.url).searchParams.get("id");

    if (id) {
      const transaction = await prisma.transactions.findUnique({
        where: {
          id: id,
        },
        include: {
          category: true,
          account: {
            include: {
              customer: true,
              vendor: true,
            },
          },
        },
      });

      response.status = 200;
      response.message = "Success";
      response.data = transaction;
      return new Response(JSON.stringify(response));
    }

    const transactions = await prisma.transactions.findMany({
      include: {
        category: true,
        account: {
          include: {
            customer: true,
            vendor: true,
          },
        },
      },
    });

    response.status = 200;
    response.message = "Success";
    response.data = transactions;
    return new Response(JSON.stringify(response));
  } catch (error: any) {
    console.log("[SERVER ERROR]: " + error.message);
    response.status = 500;
    response.message = error.message;
    response.data = null;
    return new Response(JSON.stringify(response));
  }
}

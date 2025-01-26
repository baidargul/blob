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

    if (!id) {
      response.status = 400;
      response.message = "ID is required";
      return new Response(JSON.stringify(response));
    }

    const account = await prisma.account.findUnique({
      where: {
        id: id,
      },
      include: {
        transactions: {
          take: 10,
          orderBy: {
            createdAt: "desc",
          },
          include: {
            category: true,
            purchase: {
              take: 1,
            },
            sale: {
              take: 1,
            },
          },
        },
        customer: true,
        vendor: true,
      },
    });

    if (!account) {
      response.status = 400;
      response.message = "Account not found";
      return new Response(JSON.stringify(response));
    }

    response.status = 200;
    response.message = "Success";
    response.data = account;
    return new Response(JSON.stringify(response));
  } catch (error: any) {
    console.log("[SERVER ERROR]: " + error.message);
    response.status = 500;
    response.message = error.message;
    response.data = null;
    return new Response(JSON.stringify(response));
  }
}

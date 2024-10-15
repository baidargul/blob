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

    if (!data.name) {
      response.status = 400;
      response.message = "Name is required";
      return new Response(JSON.stringify(response));
    }

    let cost = data.cost | 0;
    let price = data.price | 0;

    let isExists = await prisma.product.findFirst({
      where: {
        name: data.name,
      },
    });

    if (isExists) {
      response.status = 400;
      response.message = "Product already exists";
      return new Response(JSON.stringify(response));
    }

    const product = await prisma.product.create({
      data: {
        name: data.name,
        cost,
        price,
      },
    });

    response.status = 200;
    response.message = "Product created successfully";
    response.data = product;
    return new Response(JSON.stringify(response));
  } catch (error: any) {
    console.log("[SERVER ERROR]: " + error.message);
    response.status = 500;
    response.message = error.message;
    response.data = null;
    return new Response(JSON.stringify(response));
  }
}

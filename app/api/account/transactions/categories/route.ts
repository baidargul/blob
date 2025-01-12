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

    const isExist = await prisma.transactionCategory.findFirst({
      where: {
        name: data.name,
      },
    });

    if (isExist) {
      response.status = 400;
      response.message = "Transaction category already exists";
      return new Response(JSON.stringify(response));
    }

    const category = await prisma.transactionCategory.create({
      data: {
        name: data.name,
        description: data.description || null,
      },
    });

    response.status = 200;
    response.message = "Transaction category created successfully";
    response.data = category;
    return new Response(JSON.stringify(response));
  } catch (error: any) {
    console.log("[SERVER ERROR]: " + error.message);
    response.status = 500;
    response.message = error.message;
    response.data = null;
    return new Response(JSON.stringify(response));
  }
}

export async function GET(req: NextRequest) {
  const response = {
    status: 500,
    message: "Internal Server Error",
    data: null as any,
  };

  try {
    const id = new URL(req.url).searchParams.get("id");
    const name = new URL(req.url).searchParams.get("name");

    if (id) {
      const category = await prisma.transactionCategory.findUnique({
        where: { id },
      });

      response.status = 200;
      response.message = category
        ? "Transaction category found successfully"
        : "Transaction category not found";
      response.data = category;
      return new Response(JSON.stringify(response));
    }

    if (name) {
      const category = await prisma.transactionCategory.findFirst({
        where: {
          name: name,
        },
      });

      response.status = 200;
      response.message = category
        ? "Transaction category found successfully"
        : "Transaction category not found";
      response.data = category;
      return new Response(JSON.stringify(response));
    }

    const categories = await prisma.transactionCategory.findMany({
      orderBy: {
        name: "asc",
      },
    });

    response.status = 200;
    response.message = `Found ${categories.length} transaction categories`;
    response.data = categories;
    return new Response(JSON.stringify(response));
  } catch (error: any) {
    console.log("[SERVER ERROR]: " + error.message);
    response.status = 500;
    response.message = error.message;
    response.data = null;
    return new Response(JSON.stringify(response));
  }
}

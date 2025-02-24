import prisma from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const response = {
    status: 500,
    message: "Internal Server Error",
    data: null as any,
  };

  try {
    const type = await prisma.type.findMany({
      orderBy: {
        name: "asc",
      },
      include: {
        category: true,
      },
    });

    response.status = 200;
    response.message =
      type.length > 0 ? `Found ${type.length} types` : "No types found";
    response.data = type;
    return new Response(JSON.stringify(response));
  } catch (error: any) {
    console.log("[SERVER ERROR]: " + error.message);
    response.status = 500;
    response.message = error.message;
    response.data = null;
    return new Response(JSON.stringify(response));
  }
}

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

    if (!data.categoryId) {
      response.status = 400;
      response.message = "Category is required";
      return new Response(JSON.stringify(response));
    }

    let isExists: any;

    isExists = await prisma.category.findUnique({
      where: {
        id: data.categoryId,
      },
    });

    if (!isExists) {
      response.status = 400;
      response.message = "Category does not exist";
      return new Response(JSON.stringify(response));
    }

    isExists = await prisma.type.findFirst({
      where: {
        name: data.name,
        categoryId: data.categoryId,
      },
    });

    if (isExists) {
      response.status = 400;
      response.message = "Type already exists in this category";
      return new Response(JSON.stringify(response));
    }

    const type = await prisma.type.create({
      data: {
        name: data.name,
        description: data.description,
        categoryId: data.categoryId,
      },
    });

    response.status = 200;
    response.message = "Type created successfully";
    response.data = type;
    return new Response(JSON.stringify(response));
  } catch (error: any) {
    console.log("[SERVER ERROR]: " + error.message);
    response.status = 500;
    response.message = error.message;
    response.data = null;
    return new Response(JSON.stringify(response));
  }
}

export async function DELETE(req: NextRequest) {
  const response = {
    status: 500,
    message: "Internal Server Error",
    data: null as any,
  };

  try {
    const type = await prisma.type.deleteMany({});

    response.status = 200;
    response.message = "Type deleted successfully";
    response.data = type;
    return new Response(JSON.stringify(response));
  } catch (error: any) {
    console.log("[SERVER ERROR]: " + error.message);
    response.status = 500;
    response.message = error.message;
    response.data = null;
    return new Response(JSON.stringify(response));
  }
}

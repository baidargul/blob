import prisma from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function DELETE(req: NextRequest) {
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

    const type = await prisma.type.delete({
      where: {
        id: id,
      },
    });

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

    const type = await prisma.type.findUnique({
      where: {
        id: id,
      },
      include: {
        category: true,
      },
    });

    response.status = 200;
    response.message = "Type found successfully";
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

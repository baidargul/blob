import prisma from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const response = {
    status: 500,
    message: "Internal Server Error",
    data: null as any,
  };

  try {
    const brands = await prisma.brand.findMany({
      orderBy: {
        name: "asc",
      },
    });

    response.status = 200;
    response.message =
      brands.length > 0 ? `Found ${brands.length} brands` : "No brands found";
    response.data = brands;
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

    const brand = await prisma.brand.create({
      data: {
        name: data.name,
        description: data.description,
        address1: data.address1,
        address2: data.address2,
        phone1: data.phone1,
        phone2: data.phone2,
      },
    });

    response.status = 200;
    response.message = "Brand created successfully";
    response.data = brand;
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
    const brand = await prisma.brand.deleteMany({});

    response.status = 200;
    response.message = "Brand deleted successfully";
    response.data = brand;
    return new Response(JSON.stringify(response));
  } catch (error: any) {
    console.log("[SERVER ERROR]: " + error.message);
    response.status = 500;
    response.message = error.message;
    response.data = null;
    return new Response(JSON.stringify(response));
  }
}

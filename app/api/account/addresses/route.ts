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

    if (!data.title) {
      response.status = 400;
      response.message = "Title is required";
      return new Response(JSON.stringify(response));
    }

    if (!data.address) {
      response.status = 400;
      response.message = "Address is required";
      return new Response(JSON.stringify(response));
    }

    if (!data.accountId) {
      response.status = 400;
      response.message = "Account ID is required";
      return new Response(JSON.stringify(response));
    }

    const address = await prisma.addresses.create({
      data: {
        title: data.title,
        address: data.address,
        accountId: data.accountId,
      },
      include: {
        account: {
          include: {
            customer: true,
            vendor: true,
          },
        },
      },
    });

    response.status = 200;
    response.message = "Address created successfully";
    response.data = address;
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
    const accountId = req.nextUrl.searchParams.get("accountId");

    if (!accountId) {
      response.status = 400;
      response.message = "Account ID is required";
      return new Response(JSON.stringify(response));
    }

    const addresses = await prisma.addresses.findMany({
      where: {
        accountId: accountId,
      },
      include: {
        account: {
          include: {
            customer: true,
            vendor: true,
          },
        },
      },
    });

    response.status = 200;
    response.message = "Addresses found successfully";
    response.data = addresses;
    return new Response(JSON.stringify(response));
  } catch (error: any) {
    console.log("[SERVER ERROR]: " + error.message);
    response.status = 500;
    response.message = error.message;
    response.data = null;
    return new Response(JSON.stringify(response));
  }
}

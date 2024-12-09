import prisma from "@/lib/prisma";
import { vendor } from "@prisma/client";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const response = {
    status: 500,
    message: "Internal Server Error",
    data: null as any,
  };

  try {
    const data: any = await req.json();

    const { vendor } = data;

    console.log(`NEW VENDOR REQUEST`);
    console.log(`${vendor.name} - ${vendor.code}`);

    let isExists: any = await prisma.vendor.findUnique({
      where: {
        name: vendor.name,
      },
    });

    if (isExists) {
      response.status = 400;
      response.message = `Vendor with name ${vendor.name}`;
      return new Response(JSON.stringify(response));
    }

    if (vendor.code?.length > 0) {
      isExists = await prisma.vendor.findMany({
        where: {
          code: vendor.code,
        },
      });

      if (isExists.length > 0) {
        response.status = 400;
        response.message = `Vendor with this '${vendor.code}' already exists and Named as: ${isExists.name}`;
        return new Response(JSON.stringify(response));
      }
    }

    const newVendor = await prisma.vendor.create({
      data: {
        ...vendor,
      },
    });

    response.status = 200;
    response.message = "Vendor created";
    response.data = newVendor;
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
    const vendors = await prisma.vendor.findMany({
      orderBy: {
        name: "asc",
      },
    });

    response.status = 200;
    response.message =
      vendors.length > 0
        ? `Found ${vendors.length} vendors`
        : "No vendors found";
    response.data = vendors;
    return new Response(JSON.stringify(response));
  } catch (error: any) {
    console.log("[SERVER ERROR]: " + error.message);
    response.status = 500;
    response.message = error.message;
    response.data = null;
    return new Response(JSON.stringify(response));
  }
}

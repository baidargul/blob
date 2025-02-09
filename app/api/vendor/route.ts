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

    isExists = await prisma.account.findFirst({
      where: {
        title: {
          equals: vendor.name,
          mode: "insensitive",
        },
      },
    });

    if (isExists) {
      response.status = 400;
      response.message = `Account with title ${vendor.name} already exists`;
      return new Response(JSON.stringify(response));
    }

    if (vendor.code?.length > 0) {
      isExists = await prisma.vendor.findMany({
        where: {
          code: {
            equals: vendor.code,
            mode: "insensitive",
          },
        },
      });

      if (isExists.length > 0) {
        response.status = 400;
        response.message = `Vendor with this '${vendor.code}' already exists and Named as: ${isExists.name}`;
        return new Response(JSON.stringify(response));
      }
    }

    const account = await prisma.account.create({
      data: {
        title: vendor.name,
        type: "vendor",
      },
    });

    const newVendor = await prisma.vendor.create({
      data: {
        ...vendor,
        accountId: account.id,
      },
      include: {
        account: {
          include: {
            addresses: true,
          },
        },
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
    const query = new URL(req.url).searchParams;
    const name = query.get("name");
    const code = query.get("code");
    const id = query.get("id");

    if (name) {
      const vendor = await prisma.vendor.findFirst({
        where: {
          name: {
            equals: name,
            mode: "insensitive",
          },
        },
        include: {
          account: true,
        },
      });

      response.status = 200;
      response.message = vendor
        ? "Vendor found successfully"
        : "Vendor not found";
      response.data = vendor;
      return new Response(JSON.stringify(response));
    }

    if (code) {
      const vendor = await prisma.vendor.findFirst({
        where: {
          code: {
            equals: code,
            mode: "insensitive",
          },
        },
        include: {
          account: true,
        },
      });

      response.status = 200;
      response.message = vendor
        ? "Vendor found successfully"
        : "Vendor not found";
      response.data = vendor;
      return new Response(JSON.stringify(response));
    }

    if (id) {
      const vendor = await prisma.vendor.findUnique({
        where: {
          id: id,
        },
        include: {
          account: true,
        },
      });

      response.status = 200;
      response.message = vendor
        ? "Vendor found successfully"
        : "Vendor not found";
      response.data = vendor;
      return new Response(JSON.stringify(response));
    }

    const vendors = await prisma.vendor.findMany({
      orderBy: {
        name: "asc",
      },
      include: {
        account: {
          include: {
            addresses: true,
          },
        },
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

export async function PATCH(req: NextRequest) {
  const response = {
    status: 500,
    message: "Internal Server Error",
    data: null as any,
  };

  try {
    const data = await req.json();

    if (!data.vendor) {
      response.status = 400;
      response.message = "Vendor is required";
      return new Response(JSON.stringify(response));
    }

    let isExists: any = await prisma.vendor.findUnique({
      where: {
        id: data.vendor.id,
      },
    });

    if (!isExists) {
      response.status = 400;
      response.message = "Vendor not found";
      return new Response(JSON.stringify(response));
    }

    isExists = await prisma.vendor.findFirst({
      where: {
        name: {
          equals: data.vendor.name,
          mode: "insensitive",
        },
        NOT: {
          id: data.vendor.id,
        },
      },
    });

    if (isExists) {
      response.status = 400;
      response.message = `Vendor with name ${data.vendor.name} already exists`;
      return new Response(JSON.stringify(response));
    }

    isExists = await prisma.account.findFirst({
      where: {
        NOT: {
          id: data.vendor.accountId,
        },
        title: {
          equals: data.vendor.name,
          mode: "insensitive",
        },
      },
    });

    if (isExists) {
      response.status = 400;
      response.message = `Account with name ${data.vendor.name} already exists`;
      return new Response(JSON.stringify(response));
    }

    const account = await prisma.account.update({
      where: {
        id: data.vendor.accountId,
      },
      data: {
        title: data.vendor.name,
      },
    });

    //update everything except accountId
    const id = data.vendor.id;
    delete data.vendor.accountId;
    delete data.vendor.id;
    delete data.vendor.account;

    const vendor = await prisma.vendor.update({
      where: {
        id: id,
      },
      data: {
        ...data.vendor,
      },
      include: {
        account: {
          include: {
            addresses: true,
          },
        },
      },
    });

    response.status = 200;
    response.message = "Vendor updated";
    response.data = vendor;
    return new Response(JSON.stringify(response));
  } catch (error: any) {
    console.log("[SERVER ERROR]: " + error.message);
    response.status = 500;
    response.message = error.message;
    response.data = null;
    return new Response(JSON.stringify(response));
  }
}

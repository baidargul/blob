import prisma from "@/lib/prisma";
import { customer } from "@prisma/client";
import { randomUUID } from "crypto";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const response = {
    status: 500,
    message: "Internal Server Error",
    data: null as any,
  };

  try {
    const data: any = await req.json();

    const { customer } = data;

    console.log(`NEW CUSTOMER REQUEST`);
    console.log(`${customer.name} - ${customer.code}`);

    let isExists: any = await prisma.customer.findUnique({
      where: {
        name: customer.name,
      },
    });

    if (isExists) {
      response.status = 400;
      response.message = `Customer with name ${customer.name}`;
      return new Response(JSON.stringify(response));
    }

    isExists = await prisma.account.findFirst({
      where: {
        title: {
          equals: customer.name,
          mode: "insensitive",
        },
      },
    });

    if (isExists) {
      response.status = 400;
      response.message = `Account with title ${customer.name} already exists`;
      return new Response(JSON.stringify(response));
    }

    if (customer.code?.length > 0) {
      isExists = await prisma.customer.findMany({
        where: {
          code: {
            equals: customer.code,
            mode: "insensitive",
          },
        },
      });

      if (isExists.length > 0) {
        response.status = 400;
        response.message = `Customer with this '${customer.code}' already exists and Named as: ${isExists.name}`;
        return new Response(JSON.stringify(response));
      }
    }

    const addresses = customer.account.addresses;
    delete customer.account;
    const xnewcustomer = await prisma.customer.create({
      data: {
        ...customer,
      },
    });

    const account = await prisma.account.create({
      data: {
        title: customer.name,
        type: "customer",
      },
    });

    await prisma.addresses.deleteMany({
      where: {
        accountId: account.id,
      },
    });

    for (const address of addresses) {
      if (address.title?.length > 0) {
        await prisma.addresses.create({
          data: {
            accountId: account.id,
            title: address.title,
            address: address.address || "",
            city: address.city || "",
            updatedAt: new Date(),
            createdAt: new Date(),
          },
        });
      }
    }

    const newcustomer = await prisma.customer.update({
      data: {
        accountId: account.id,
      },
      where: {
        id: xnewcustomer.id,
      },
    });

    response.status = 200;
    response.message = "customer created";
    response.data = newcustomer;
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
      const customer = await prisma.customer.findFirst({
        where: {
          name: {
            equals: name,
            mode: "insensitive",
          },
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
      response.message = customer
        ? "customer found successfully"
        : "customer not found";
      response.data = customer;
      return new Response(JSON.stringify(response));
    }

    if (code) {
      const customer = await prisma.customer.findFirst({
        where: {
          code: {
            equals: code,
            mode: "insensitive",
          },
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
      response.message = customer
        ? "customer found successfully"
        : "customer not found";
      response.data = customer;
      return new Response(JSON.stringify(response));
    }

    if (id) {
      const customer = await prisma.customer.findUnique({
        where: {
          id: id,
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
      response.message = customer
        ? "customer found successfully"
        : "customer not found";
      response.data = customer;
      return new Response(JSON.stringify(response));
    }

    const customers = await prisma.customer.findMany({
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
      customers.length > 0
        ? `Found ${customers.length} customers`
        : "No customers found";
    response.data = customers;
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

    if (!data.customer) {
      response.status = 400;
      response.message = "Customer is required";
      return new Response(JSON.stringify(response));
    }

    let isExists: any = await prisma.customer.findUnique({
      where: {
        id: data.customer.id,
      },
    });

    if (!isExists) {
      response.status = 400;
      response.message = "Customer not found";
      return new Response(JSON.stringify(response));
    }

    isExists = await prisma.customer.findFirst({
      where: {
        name: {
          equals: data.customer.name,
          mode: "insensitive",
        },
        NOT: {
          id: data.customer.id,
        },
      },
    });

    if (isExists) {
      response.status = 400;
      response.message = `Customer with name ${data.customer.name} already exists`;
      return new Response(JSON.stringify(response));
    }

    isExists = await prisma.account.findFirst({
      where: {
        NOT: {
          id: data.customer.accountId,
        },
        title: {
          equals: data.customer.name,
          mode: "insensitive",
        },
      },
    });

    if (isExists) {
      response.status = 400;
      response.message = `Account with name ${data.customer.name} already exists`;
      return new Response(JSON.stringify(response));
    }

    const account = await prisma.account.update({
      where: {
        id: data.customer.accountId,
      },
      data: {
        title: data.customer.name,
      },
    });

    const addresses = data.customer.account.addresses;
    await prisma.addresses.deleteMany({
      where: {
        accountId: account.id,
      },
    });

    for (const address of addresses) {
      if (address.title?.length > 0) {
        await prisma.addresses.create({
          data: {
            accountId: account.id,
            title: address.title,
            address: address.address || "",
            city: address.city || "",
            updatedAt: new Date(),
            createdAt: new Date(),
          },
        });
      }
    }

    //update everything except accountId
    const id = data.customer.id;
    delete data.customer.accountId;
    delete data.customer.id;
    delete data.customer.account;

    const customer = await prisma.customer.update({
      where: {
        id: id,
      },
      data: {
        ...data.customer,
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
    response.message = "Customer updated";
    response.data = customer;
    return new Response(JSON.stringify(response));
  } catch (error: any) {
    console.log("[SERVER ERROR]: " + error.message);
    response.status = 500;
    response.message = error.message;
    response.data = null;
    return new Response(JSON.stringify(response));
  }
}

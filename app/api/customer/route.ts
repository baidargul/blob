import prisma from "@/lib/prisma";
import { customer } from "@prisma/client";
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
      response.message = `customer with name ${customer.name}`;
      return new Response(JSON.stringify(response));
    }

    isExists = await prisma.account.findFirst({
      where: {
        title: customer.name,
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
          code: customer.code,
        },
      });

      if (isExists.length > 0) {
        response.status = 400;
        response.message = `customer with this '${customer.code}' already exists and Named as: ${isExists.name}`;
        return new Response(JSON.stringify(response));
      }
    }

    const account = await prisma.account.create({
      data: {
        title: customer.name,
        type: "customer",
      },
    });

    const newcustomer = await prisma.customer.create({
      data: {
        ...customer,
        accountId: account.id,
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
          account: true,
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
          account: true,
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
          account: true,
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
        account: true,
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

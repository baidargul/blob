import prisma from "@/lib/prisma";
import { accountType } from "@prisma/client";
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

    if (!data.type) {
      response.status = 400;
      response.message = "Type is required";
      return new Response(JSON.stringify(response));
    }

    const account = {
      title: data.title,
      type: data.type,
      description: data.description || null,
      balance: data.balance || 0,
    };

    let isExists = await prisma.account.findFirst({
      where: {
        title: account.title,
      },
    });

    if (isExists) {
      response.status = 400;
      response.message = `Account title '${account.title}' already exists`;
      return new Response(JSON.stringify(response));
    }

    const newAccount = await prisma.account.create({
      data: account,
    });

    const accounts = await prisma.account.findMany({
      orderBy: [{ title: "asc" }, { balance: "desc" }],
      include: {
        customer: true,
        purchase: true,
        transactions: true,
        vendor: true,
      },
    });

    response.status = 200;
    response.message = "Account created successfully";
    response.data = accounts;
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
    const title = query.get("title");
    const id = query.get("id");

    if (title) {
      const accounts = await prisma.account.findFirst({
        where: {
          title: {
            equals: title,
            mode: "insensitive",
          },
        },
      });

      response.status = 200;
      response.message = accounts
        ? "Account found successfully"
        : "Account not found";
      response.data = accounts;
      return new Response(JSON.stringify(response));
    }

    if (id) {
      const account = await prisma.account.findUnique({
        where: {
          id: id,
        },
      });

      response.status = 200;
      response.message = account
        ? "Account found successfully"
        : "Account not found";
      response.data = account;
      return new Response(JSON.stringify(response));
    }

    const accounts = await prisma.account.findMany({
      orderBy: [
        {
          title: "asc",
        },
        { createdAt: "desc" },
      ],
    });

    response.status = 200;
    response.message = `${accounts.length} accounts retrieved successfully.`;
    response.data = accounts;
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
    const id = new URL(req.url).searchParams.get("id");

    if (!id) {
      response.status = 400;
      response.message = "ID is required";
      return new Response(JSON.stringify(response));
    }

    const account = await prisma.account.delete({
      where: {
        id: id,
      },
    });

    const accounts = await prisma.account.findMany({
      orderBy: [{ title: "asc" }, { balance: "desc" }],
      include: {
        customer: true,
        purchase: true,
        transactions: true,
        vendor: true,
      },
    });

    response.status = 200;
    response.message = "Account deleted successfully";
    response.data = accounts;
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

    if (!data.id) {
      response.status = 400;
      response.message = "ID is required";
      return new Response(JSON.stringify(response));
    }

    let isExists: any;
    const uData: any = {};
    if (data.title) {
      isExists = await prisma.account.findFirst({
        where: {
          title: data.title,
          NOT: {
            id: data.id,
          },
        },
      });

      if (isExists) {
        response.status = 400;
        response.message = "Title already exists";
        return new Response(JSON.stringify(response));
      }
      uData.title = data.title;
    }

    if (data.type) {
      uData.type = data.type;
    }

    if (data.type === accountType.customer) {
      isExists = await prisma.customer.findFirst({
        where: {
          name: data.title,
          NOT: {
            accountId: data.id,
          },
        },
      });

      if (isExists) {
        response.status = 400;
        response.message = "Customer with this name already exists";
        return new Response(JSON.stringify(response));
      }

      await prisma.customer.update({
        where: {
          accountId: data.id,
        },
        data: {
          name: data.title,
        },
      });
    }

    if (data.type === accountType.vendor) {
      isExists = await prisma.vendor.findFirst({
        where: {
          name: data.title,
          NOT: {
            accountId: data.id,
          },
        },
      });

      if (isExists) {
        response.status = 400;
        response.message = "Vendor with this name already exists";
        return new Response(JSON.stringify(response));
      }

      await prisma.vendor.update({
        where: {
          accountId: data.id,
        },
        data: {
          name: data.title,
        },
      });
    }

    const account = await prisma.account.update({
      where: {
        id: data.id,
      },
      data: uData,
      include: {
        customer: true,
        vendor: true,
      },
    });

    const accounts = await prisma.account.findMany({
      orderBy: [{ title: "asc" }, { balance: "desc" }],
      include: {
        customer: true,
        purchase: true,
        transactions: true,
        vendor: true,
        sale: true,
      },
    });

    response.status = 200;
    response.message = "Account updated successfully";
    response.data = accounts;
    return new Response(JSON.stringify(response));
  } catch (error: any) {
    console.log("[SERVER ERROR]: " + error.message);
    response.status = 500;
    response.message = error.message;
    response.data = null;
    return new Response(JSON.stringify(response));
  }
}

import prisma from "@/lib/prisma";
import { serverCommands } from "@/SERVER_COMMANDS/serverCommands";
import { transactionType } from "@prisma/client";

async function closeSale(saleId: string) {
  await serverCommands.initialize();

  const response = {
    status: 500,
    message: "Internal Server Error",
    data: null as any,
  };

  const sale = await prisma.sale.findUnique({
    where: {
      id: saleId,
    },
    include: {
      barcodeRegister: {
        include: {
          product: {
            include: {
              brand: true,
              category: true,
              type: true,
            },
          },
        },
        orderBy: [{ product: { name: "asc" } }, { soldAt: "desc" }],
      },
      account: {
        include: {
          customer: true,
        },
      },
    },
  });

  if (!sale) {
    response.status = 404;
    response.message = "Sale not found";
    response.data = null;
    return response;
  }

  if (!sale.account) {
    response.status = 404;
    response.message = "No account found for this sale";
    response.data = null;
    return response;
  }

  let totalCost = 0;
  let products: {
    name: string;
    cost: number;
    color: string;
    quantity: number;
    total: number;
  }[] = [];
  for (const item of sale.barcodeRegister) {
    totalCost = Number(totalCost) + Number(item.cost);

    // Flag to check if the product exists
    let found = false;

    for (const product of products) {
      if (
        product.name === item.product.name &&
        Number(product.cost) === Number(item.cost) &&
        product.color === item.color
      ) {
        // Update quantity and total for existing product
        product.quantity = product.quantity + 1;
        product.total = Number(product.total) + Number(item.cost);
        found = true; // Mark as found
        break; // Exit loop as product is already updated
      }
    }

    // If product was not found, add it as new
    if (!found) {
      products.push({
        name: item.product.name,
        cost: Number(item.cost),
        color: item.color || "",
        quantity: 1,
        total: Number(item.cost),
      });
    }
  }

  let summary = "";
  for (const product of products) {
    summary += `[${product.name} ${product.color} x ${
      product.quantity
    } @ Rs ${product.cost.toFixed(2)} = Rs ${product.total.toFixed(2)}]\n\n`;
  }
  summary = summary + `Total: Rs ${totalCost.toFixed(2)}`;

  const transactionCategory = await prisma.transactionCategory.findFirst({
    where: {
      name: "sale",
    },
  });

  if (!transactionCategory) {
    response.status = 400;
    response.message = "Transaction category not found";
    return response;
  }

  const account = await prisma.account.findUnique({
    where: {
      id: sale.account.id,
    },
  });

  if (!account) {
    response.status = 400;
    response.message = "Account not found";
    return response;
  }

  let trans = await prisma.transactions.create({
    data: {
      accountId: sale.account.id,
      type: transactionType.credit,
      amount: totalCost,
      transactionCategoryId: transactionCategory.id,
      description: summary,
      balance: Number(account.balance) - Number(totalCost),
    },
  });

  if (!trans) {
    response.status = 400;
    response.message = "Transaction not created";
    return response;
  }

  response.status = 200;
  response.message = "Sale closed successfully";
  response.data = null;
  return response;
}

export const sale = {
  closeSale,
};

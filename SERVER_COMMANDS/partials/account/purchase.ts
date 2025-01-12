import prisma from "@/lib/prisma";
import { serverCommands } from "@/SERVER_COMMANDS/serverCommands";
import { SERVER_RESPONSE } from "@/serverActions/internal/server";
import { transactionType } from "@prisma/client";

async function closePurchase(purchaseId: string): Promise<SERVER_RESPONSE> {
  await serverCommands.initialize();

  const response = {
    status: 500,
    message: "Internal Server Error",
    data: null as any,
  };

  const purchase = await prisma.purchase.findUnique({
    where: { id: purchaseId },
    include: {
      account: {
        include: {
          vendor: true,
        },
      },
      barcodeRegister: {
        include: {
          inventory: true,
          product: true,
        },
        orderBy: [{ product: { name: "asc" } }, { createdAt: "asc" }],
      },
    },
  });

  if (!purchase) {
    response.status = 400;
    response.message = "Purchase not found";
    return response;
  }

  if (!purchase.account) {
    response.status = 400;
    response.message = "Vendor has no account";
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
  for (const item of purchase.barcodeRegister) {
    totalCost = Number(totalCost) + Number(item.cost);
    //compare name, cost, color if found update quantity and total else add new product FOR SUMMARY STATEMENT
    for (const product of products) {
      if (
        product.name === item.product.name &&
        Number(product.cost) === Number(item.cost) &&
        product.color === item.color
      ) {
        product.quantity = product.quantity + 1;
        product.total = Number(product.total) + Number(item.cost);
      } else {
        products.push({
          name: item.product.name,
          cost: Number(item.cost),
          color: item.color || "",
          quantity: 1,
          total: Number(item.cost),
        });
      }
    }
  }

  let summary = "";
  for (const product of products) {
    summary += `${product.name} ${product.color} x ${
      product.quantity
    } @ Rs ${product.cost.toFixed(2)} = Rs ${product.total.toFixed(2)}\n\n`;
  }
  summary += `Total: Rs ${totalCost.toFixed(2)}`;

  const transactionCategory = await prisma.transactionCategory.findFirst({
    where: {
      name: "purchase",
    },
  });

  if (!transactionCategory) {
    response.status = 400;
    response.message = "Transaction category not found";
    return response;
  }

  await prisma.transactions.create({
    data: {
      accountId: purchase.account.id,
      type: transactionType.debit,
      amount: totalCost,
      transactionCategoryId: transactionCategory.id,
      description: summary,
    },
  });

  response.status = 200;
  response.message = "Purchase Transaction Complete";
  response.data = null;
  return response;
}

export const purchase = {
  closePurchase,
};

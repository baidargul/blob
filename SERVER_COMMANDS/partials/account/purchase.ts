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
    summary =
      summary +
      `${product.name} ${product.color} x ${
        product.quantity
      } @ Rs ${product.cost.toFixed(2)} = Rs ${product.total.toFixed(2)}\n\n`;
  }
  summary = summary + `Total: Rs ${totalCost.toFixed(2)}`;

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

  const trans = await prisma.transactions.create({
    data: {
      accountId: purchase.account.id,
      type: transactionType.debit,
      amount: totalCost,
      transactionCategoryId: transactionCategory.id,
      description: summary,
    },
  });

  if (!trans) {
    response.status = 400;
    response.message = "Transaction not created";
    return response;
  }

  await prisma.account.update({
    where: {
      id: purchase.account.id,
    },
    data: {
      balance: {
        decrement: totalCost,
      },
    },
  });

  response.status = 200;
  response.message = "Purchase Transaction Complete";
  response.data = null;
  return response;
}
async function cancelPurchase(purchaseId: string): Promise<SERVER_RESPONSE> {
  const response = {
    status: 500,
    message: "Internal Server Error",
    data: null as any,
  };

  const purchase = await prisma.purchase.findUnique({
    where: {
      id: purchaseId,
    },
    include: {
      barcodeRegister: {
        include: {
          inventory: true,
          product: {
            include: {
              productImages: {
                include: {
                  images: true,
                },
              },
              type: true,
              brand: true,
              category: true,
            },
          },
        },
      },
      account: {
        include: {
          vendor: true,
        },
      },
    },
  });

  if (!purchase) {
    response.status = 400;
    response.message = "Purchase not found";
    return response;
  }

  let notInInventory: boolean = false;

  for (const item of purchase.barcodeRegister) {
    if (item.inventory.length === 0) {
      notInInventory = true;
    }
  }

  if (notInInventory) {
    response.status = 400;
    response.message = `Purchase items are not in the inventory`;
    return response;
  }

  if (!purchase.account) {
    response.status = 400;
    response.message = "Vendor has no account";
    return response;
  }

  if (!purchase.account.vendor) {
    response.status = 400;
    response.message = "Vendor not assigned to this purchase";
    return response;
  }

  let totalCost = 0;
  for (const item of purchase.barcodeRegister) {
    totalCost = Number(totalCost) + Number(item.cost);
  }

  let summary = "";
  summary = `Purchase cancelled for order no '${purchase.orderNo}@ ${new Date(
    String(purchase.purchaseDate)
  ).toLocaleDateString()} ${new Date(
    String(purchase.purchaseDate)
  ).toLocaleTimeString()}'\n\n`;
  summary = summary + `Total: Rs ${totalCost}`;

  const transactionCategory = await prisma.transactionCategory.findFirst({
    where: {
      name: "purchase return",
    },
  });

  if (!transactionCategory) {
    response.status = 400;
    response.message = "Transaction category not found";
    return response;
  }

  const trans = await prisma.transactions.create({
    data: {
      accountId: purchase.account.id,
      type: transactionType.credit,
      amount: totalCost,
      transactionCategoryId: transactionCategory.id,
      description: summary,
    },
  });

  if (!trans) {
    response.status = 400;
    response.message = "Transaction not created";
    return response;
  }

  await prisma.account.update({
    where: {
      id: purchase.account.id,
    },
    data: {
      balance: {
        increment: totalCost,
      },
    },
  });

  for (const item of purchase.barcodeRegister) {
    await prisma.inventory.deleteMany({
      where: {
        barcodeRegisterId: item.id,
      },
    });

    await prisma.barcodeRegister.deleteMany({
      where: {
        id: item.id,
      },
    });
  }

  await prisma.purchase.delete({
    where: {
      id: purchaseId,
    },
  });

  response.status = 200;
  response.message = "Purchase cancelled successfully";
  response.data = null;
  return response;
}

export const purchase = {
  closePurchase,
  cancelPurchase,
};

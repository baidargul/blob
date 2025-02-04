import prisma from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import { serverCommands } from "@/SERVER_COMMANDS/serverCommands";
import { accountType, transactionType } from "@prisma/client";

async function closeSale(saleId: string, paidAmount?: number) {
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
    soldAt: number;
    color: string;
    quantity: number;
    total: number;
  }[] = [];
  for (const item of sale.barcodeRegister) {
    totalCost = Number(totalCost) + Number(item.soldAt);

    // Flag to check if the product exists
    let found = false;

    for (const product of products) {
      if (
        product.name === item.product.name &&
        Number(product.soldAt) === Number(item.soldAt) &&
        product.color === item.color
      ) {
        // Update quantity and total for existing product
        product.quantity = product.quantity + 1;
        product.total = Number(product.total) + Number(item.soldAt);
        found = true; // Mark as found
        break; // Exit loop as product is already updated
      }
    }

    // If product was not found, add it as new
    if (!found) {
      products.push({
        name: item.product.name,
        soldAt: Number(item.soldAt),
        color: item.color || "",
        quantity: 1,
        total: Number(item.soldAt),
      });
    }
  }

  let summary = "";
  for (const product of products) {
    summary += `[${product.name} ${product.color} x ${
      product.quantity
    } @ Rs ${product.soldAt.toFixed(2)} = Rs ${product.total.toFixed(2)}]\n\n`;
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

  let account = await prisma.account.findUnique({
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

  if (!trans) {
    response.status = 400;
    response.message = "Transaction not created";
    return response;
  }

  await prisma.sale.update({
    where: {
      id: sale.id,
    },
    data: {
      transactionId: trans.id,
    },
  });

  await prisma.account.update({
    where: {
      id: sale.account.id,
    },
    data: {
      balance: Number(account.balance) - Number(totalCost),
    },
  });

  const cogs = await prisma.account.findFirst({
    where: {
      type: accountType.cogs,
    },
  });

  if (cogs) {
    await prisma.transactions.create({
      data: {
        accountId: cogs.id,
        type: transactionType.credit,
        amount: totalCost,
        transactionCategoryId: transactionCategory.id,
        description: `Sale order #${sale.orderNo} ${
          sale.saleDate &&
          `@${formatDate(new Date(sale.saleDate))}\n\n ${
            sale?.account &&
            sale?.account?.customer?.name &&
            `Customer: ${sale.account.customer.name}`
          }`
        }`,
        balance: Number(cogs.balance) + Number(totalCost),
      },
    });
    await prisma.account.update({
      where: {
        id: cogs.id,
      },
      data: {
        balance: {
          increment: Number(totalCost),
        },
      },
    });
  }

  const incomeAccount = await prisma.account.findFirst({
    where: {
      title: {
        equals: "Income",
        mode: "insensitive",
      },
    },
  });

  if (incomeAccount) {
    await prisma.transactions.create({
      data: {
        accountId: incomeAccount.id,
        type: transactionType.credit,
        amount: totalCost,
        transactionCategoryId: transactionCategory.id,
        description: `Sale order #${sale.orderNo} ${
          sale.saleDate &&
          `@${formatDate(new Date(sale.saleDate))}\n\n ${
            sale?.account &&
            sale?.account?.customer?.name &&
            `Customer: ${sale.account.customer.name}`
          }`
        }`,
        balance: Number(incomeAccount.balance) + Number(totalCost),
      },
    });

    await prisma.account.update({
      where: {
        id: incomeAccount.id,
      },
      data: {
        balance: Number(incomeAccount.balance) + Number(totalCost),
      },
    });
  }

  const cashAccount = await prisma.account.findFirst({
    where: {
      title: {
        equals: "Cash",
        mode: "insensitive",
      },
    },
  });

  if (cashAccount) {
    await prisma.transactions.create({
      data: {
        accountId: cashAccount.id,
        type: transactionType.credit,
        amount: totalCost,
        transactionCategoryId: transactionCategory.id,
        description: `Sale order #${sale.orderNo} ${
          sale.saleDate &&
          `@${formatDate(new Date(sale.saleDate))}\n\n ${
            sale?.account &&
            sale?.account?.customer?.name &&
            `Customer: ${sale.account.customer.name}`
          }`
        }`,
        balance: Number(cashAccount.balance) - Number(totalCost),
      },
    });

    await prisma.account.update({
      where: {
        id: cashAccount.id,
      },
      data: {
        balance: Number(cashAccount.balance) + Number(totalCost),
      },
    });
  }

  //ONLY IF HE PAYS CASH FOR NOW ALLOWED
  account = await prisma.account.findUnique({
    where: {
      id: sale.account.id,
    },
  });

  if (!account) {
    response.status = 400;
    response.message = "Account not found";
    return response;
  }
  if (paidAmount && paidAmount > 0) {
    const cashCategoryId = await prisma.transactionCategory.findFirst({
      where: {
        name: {
          equals: "cash",
          mode: "insensitive",
        },
      },
    });

    await prisma.transactions.create({
      data: {
        accountId: sale.account.id,
        type: transactionType.debit,
        amount: paidAmount,
        transactionCategoryId: cashCategoryId
          ? cashCategoryId.id
          : transactionCategory.id,
        description: summary,
        balance: Number(account.balance) + Number(paidAmount),
      },
    });

    await prisma.account.update({
      where: {
        id: sale.account.id,
      },
      data: {
        balance: Number(account.balance) + Number(paidAmount),
      },
    });
  }

  response.status = 200;
  response.message = "Sale closed successfully";
  response.data = null;
  return response;
}

export const sale = {
  closeSale,
};

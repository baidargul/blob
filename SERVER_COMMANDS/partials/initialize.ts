import prisma from "@/lib/prisma";
import { accountType } from "@prisma/client";

const transactionCategories = [
  "purchase",
  "purchase return",
  "sale",
  "salary",
  "rent",
  "bill",
  "repair",
  "maintainance",
  "cash",
  "other",
];

async function initializeTransactionCategories() {
  for (const category of transactionCategories) {
    const isExists = await prisma.transactionCategory.findFirst({
      where: {
        name: category,
      },
    });
    if (!isExists) {
      await prisma.transactionCategory.create({
        data: {
          name: category,
          description: null,
        },
      });
    }
  }
}

const standardAccounts: {
  title: string;
  type: accountType;
  balance: number;
}[] = [
  { title: "expenses", type: accountType.expenses, balance: 0 },
  { title: "cash", type: accountType.cash, balance: 0 },
  { title: "bank", type: accountType.bank, balance: 0 },
  { title: "income", type: accountType.income, balance: 0 },
  { title: "cost of goods purchased", type: accountType.cogp, balance: 0 },
  { title: "cost of goods sold", type: accountType.cogs, balance: 0 },
];

async function initializeAccounts() {
  for (const account of standardAccounts) {
    const isExists = await prisma.account.findFirst({
      where: {
        title: account.title,
      },
    });
    if (!isExists) {
      await prisma.account.create({
        data: {
          title: account.title,
          type: account.type,
          description: null,
          balance: account.balance,
        },
      });
    }
  }
}

export async function initialize() {
  const response = {
    status: 500,
    message: "Internal Server Error",
    data: null as any,
  };

  try {
    await initializeTransactionCategories();
    await initializeAccounts();
    response.status = 200;
    response.message = "Server initialized successfully";
    response.data = null;
    return new Response(JSON.stringify(response));
  } catch (error: any) {
    console.log("[SERVER ERROR]: [INITIALIZATION] " + error.message);
    response.status = 500;
    response.message = error.message;
    response.data = null;
    return new Response(JSON.stringify(response));
  }
}

import prisma from "@/lib/prisma";

const transactionCategories = [
  "purchase",
  "sale",
  "salary",
  "rent",
  "bill",
  "repair",
  "maintainance",
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

export async function initialize() {
  const response = {
    status: 500,
    message: "Internal Server Error",
    data: null as any,
  };

  try {
    await initializeTransactionCategories();
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

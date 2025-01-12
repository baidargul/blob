import prisma from "@/lib/prisma";

async function processPurchase(purchaseId: string) {
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
    return new Response(JSON.stringify(response));
  }

  if (!purchase.account) {
    response.status = 400;
    response.message = "Vendor has no account";
    return new Response(JSON.stringify(response));
  }

  let totalCost = 0;
  for (const item of purchase.barcodeRegister) {
    totalCost = Number(totalCost) + Number(item.cost);
  }
}

export const account = {};

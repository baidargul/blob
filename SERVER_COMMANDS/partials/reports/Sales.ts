import prisma from "@/lib/prisma";
import { PRODUCT_FORMAT_FOR_REPORT } from "@/serverActions/internal/partials/reports";

async function getSale(fromDate: Date, toDate: Date) {
  const sale = await prisma.barcodeRegister.findMany({
    include: {
      product: {
        include: {
          brand: true,
          category: true,
          type: true,
          productImages: {
            include: {
              images: true,
            },
          },
        },
      },
      purchase: {
        include: {
          account: {
            include: {
              vendor: true,
            },
          },
        },
      },
      sale: {
        include: {
          account: {
            include: {
              customer: true,
            },
          },
        },
      },
    },
    where: {
      sale: {
        createdAt: {
          gte: new Date(fromDate),
          lte: new Date(new Date(toDate)),
        },
      },
    },
  });

  let sales = [];
  for (const ths of sale) {
    const product = PRODUCT_FORMAT_FOR_REPORT(ths);
    sales.push(product);
  }

  return sales;
}

export const sales = {
  getSale,
};

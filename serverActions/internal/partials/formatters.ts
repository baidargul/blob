import prisma from "@/lib/prisma";

export const getProduct = async (id: string, barcode: string) => {
  let finalProduct = null;
  if (barcode.length > 0) {
    finalProduct = await prisma.product.findUnique({
      where: {
        id: id,
      },
      include: {
        barcodeRegister: {
          where: {
            barcode: barcode,
          },
          include: {
            purchase: true,
            inventory: true,
          },
        },
        category: true,
        brand: true,
        productImages: {
          include: {
            images: true,
          },
        },
        type: true,
      },
    });
  } else {
    finalProduct = await prisma.product.findUnique({
      where: {
        id: id,
      },
      include: {
        category: true,
        brand: true,
        productImages: {
          include: {
            images: true,
          },
        },
        type: true,
      },
    });
  }
  return finalProduct;
};

export const getPurchase = async (id: string) => {
  const finalPurchase = await prisma.purchase.findUnique({
    where: {
      id: id,
    },
    include: {
      barcodeRegister: {
        include: {
          product: true,
        },
      },
    },
  });

  let products = [];
  if (finalPurchase) {
    for (const item of finalPurchase.barcodeRegister) {
      const temp = await Formatter.getProduct(
        item.productId,
        item.barcode || ""
      );
      products.push(temp);
    }
  }

  return { ...finalPurchase, products: products };
};

export const Formatter = {
  getProduct,
  getPurchase,
};

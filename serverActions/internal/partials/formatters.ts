import prisma from "@/lib/prisma";

export const getProduct = async (id: string, barcode: string) => {
  const finalProduct = await prisma.product.findUnique({
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
        },
      },
      category: true,
      brand: true,
      productImages: true,
      type: true,
    },
  });
  return finalProduct;
};

export const Formatter = {
  getProduct,
};

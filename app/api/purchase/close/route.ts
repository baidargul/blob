import prisma from "@/lib/prisma";
import { Formatter } from "@/serverActions/internal/partials/formatters";
import { NextRequest } from "next/server";

export async function PATCH(req: NextRequest) {
  const response = {
    status: 500,
    message: "Internal Server Error",
    data: null as any,
  };

  try {
    const data = await req.json();
    if (!data.id) {
      response.status = 400;
      response.message = "ID is required";
      return new Response(JSON.stringify(response));
    }

    let purchase: any = await prisma.purchase.findUnique({
      include: {
        barcodeRegister: {
          include: {
            product: true,
          },
        },
      },
      where: {
        id: data.id,
      },
    });

    if (!purchase) {
      response.status = 404;
      response.message = "Purchase not found";
      return new Response(JSON.stringify(response));
    }

    if (purchase.barcodeRegister.length === 0) {
      await prisma.purchase.delete({
        where: {
          id: data.id,
        },
      });

      response.status = 201;
      response.message = "Purchase scrapped as no products were found";
      response.data = null;
      return new Response(JSON.stringify(response));
    }

    if (!purchase.vendorId || purchase.vendorId.length === 0) {
      response.status = 400;
      response.message =
        "No vendor is assigned to this purchase yet! Please assign before closing this purchase order.";
      return new Response(JSON.stringify(response));
    }

    for (const item of purchase.barcodeRegister) {
      await prisma.inventory.create({
        data: {
          barcodeRegisterId: item.id,
        },
      });
    }

    const temp = purchase.closed === true ? false : true;
    purchase = await prisma.purchase.update({
      where: {
        id: data.id,
      },
      data: {
        closed: temp,
      },
    });

    purchase = await Formatter.getPurchase(purchase.id);

    response.status = 200;
    response.message = "Purchase closed successfully";
    response.data = purchase;
    return new Response(JSON.stringify(response));
  } catch (error: any) {
    console.log("[SERVER ERROR]: " + error.message);
    response.status = 500;
    response.message = error.message;
    response.data = null;
    return new Response(JSON.stringify(response));
  }
}

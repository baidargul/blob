import prisma from "@/lib/prisma";
import { product, productImages } from "@prisma/client";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const response = {
    status: 500,
    message: "Internal Server Error",
    data: null as any,
  };

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      response.status = 400;
      response.message = "ID is required";
      return new Response(JSON.stringify(response));
    }

    const product = await prisma.product.findUnique({
      where: {
        id: id,
      },
      include: {
        productImages: {
          include: {
            images: true,
          },
        },
      },
    });

    const images = product?.productImages.map((image) => image.images);

    const productWithImages = {
      ...product,
      images,
    };

    response.status = 200;
    response.message = product
      ? `'${product.name}' found`
      : "Product not found";
    response.data = productWithImages;
    return new Response(JSON.stringify(response));
  } catch (error: any) {
    console.log("[SERVER ERROR]: " + error.message);
    response.status = 500;
    response.message = error.message;
    response.data = null;
    return new Response(JSON.stringify(response));
  }
}

export async function DELETE(req: any) {
  const response = {
    status: 500,
    message: "Internal Server Error",
    data: null as any,
  };

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      response.status = 400;
      response.message = "ID is required";
      return new Response(JSON.stringify(response));
    }

    const product: product | null = await prisma.product.findUnique({
      where: {
        id: id,
      },
    });

    if (!product) {
      response.status = 400;
      response.message = "Product not found";
      return new Response(JSON.stringify(response));
    }

    const images: productImages[] = await prisma.productImages.findMany({
      where: {
        productId: product.id,
      },
    });
    console.log(`IMAGES`);
    console.log(images);

    for (const image of images) {
      await prisma.productImages.deleteMany({
        where: {
          imageId: image.imageId,
        },
      });
      await prisma.images.delete({
        where: {
          id: image.imageId,
        },
      });
    }

    await prisma.product.delete({
      where: {
        id: product.id,
      },
    });

    response.status = 200;
    response.message = product
      ? `'${product.name}' deleted`
      : "Product not found";
    response.data = product;
    return new Response(JSON.stringify(response));
  } catch (error: any) {
    console.log("[SERVER ERROR]: " + error.message);
    response.status = 500;
    response.message = error.message;
    response.data = null;
    return new Response(JSON.stringify(response));
  }
}

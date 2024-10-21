import prisma from "@/lib/prisma";
import { SERVER } from "@/serverActions/internal/server";
import { images, productImages } from "@prisma/client";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const response = {
    status: 500,
    message: "Internal Server Error",
    data: null as any,
  };

  try {
    const data = await req.json();

    if (!data.name) {
      response.status = 400;
      response.message = "Name is required";
      return new Response(JSON.stringify(response));
    }

    if (!data.brand.name) {
      response.status = 400;
      response.message = "Brand is required";
      return new Response(JSON.stringify(response));
    }

    if (!data.category.name) {
      response.status = 400;
      response.message = "Category is required";
      return new Response(JSON.stringify(response));
    }

    if (!data.type.name) {
      response.status = 400;
      response.message = "Type is required";
      return new Response(JSON.stringify(response));
    }

    let cost = data.cost | 0;
    let price = data.price | 0;

    let isExists: any = await prisma.product.findFirst({
      where: {
        name: data.name,
      },
    });

    if (isExists) {
      response.status = 400;
      response.message = "Product already exists";
      return new Response(JSON.stringify(response));
    }

    isExists = await prisma.brand.findFirst({
      where: {
        name: data.brand.name,
      },
    });

    if (!isExists) {
      response.status = 400;
      response.message = "Brand does not exist";
      return new Response(JSON.stringify(response));
    }

    isExists = await prisma.category.findFirst({
      where: {
        name: data.category.name,
      },
    });

    if (!isExists) {
      response.status = 400;
      response.message = "Category does not exist";
      return new Response(JSON.stringify(response));
    }

    isExists = await prisma.type.findFirst({
      where: {
        name: data.type.name,
      },
    });

    if (!isExists) {
      response.status = 400;
      response.message = "Type does not exist";
      return new Response(JSON.stringify(response));
    }

    const doImages = await SERVER.images.createBulk(data.images);

    if (doImages.status !== 200) {
      response.status = doImages.status;
      response.message = doImages.message;
      response.data = null;
      return new Response(JSON.stringify(response));
    }

    const images: images[] = doImages.data.successfulImages;

    const product = await prisma.product.create({
      data: {
        name: data.name,
        cost,
        price,
      },
    });

    for (const image of images) {
      await prisma.productImages.create({
        data: {
          imageId: image.id,
          productId: product.id,
        },
      });
    }

    const newProduct = await prisma.product.findUnique({
      where: {
        id: product.id,
      },
      include: {
        productImages: {
          include: {
            images: true,
          },
        },
      },
    });

    response.status = 200;
    response.message = "Product created successfully";
    response.data = newProduct;
    return new Response(JSON.stringify(response));
  } catch (error: any) {
    console.log("[SERVER ERROR]: " + error.message);
    response.status = 500;
    response.message = error.message;
    response.data = null;
    return new Response(JSON.stringify(response));
  }
}

export async function GET(req: NextRequest) {
  const response = {
    status: 500,
    message: "Internal Server Error",
    data: null as any,
  };

  try {
    const products: any = await prisma.product.findMany({
      include: {
        productImages: {
          include: {
            images: true,
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    });

    products.forEach((product: any) => {
      product.images = product.productImages.map((image: any) => image.images);
    });

    response.status = 200;
    response.message =
      products.length > 0
        ? `Found ${products.length} products`
        : "No products found";
    response.data = products;
    return new Response(JSON.stringify(response));
  } catch (error: any) {
    console.log("[SERVER ERROR]: " + error.message);
    response.status = 500;
    response.message = error.message;
    response.data = null;
    return new Response(JSON.stringify(response));
  }
}

export async function DELETE(req: NextRequest) {
  const response = {
    status: 500,
    message: "Internal Server Error",
    data: null as any,
  };

  try {
    const productList = await prisma.product.findMany({
      select: {
        id: true,
      },
    });

    const images: productImages[] = await prisma.productImages.findMany({
      where: {
        productId: {
          in: productList.map((product) => product.id),
        },
      },
    });

    console.log(images);
    for (const image of images) {
      const res = await SERVER.images.removeImage(image.imageId);
      // await prisma.images.delete({
      //   where: {
      //     id: image.imageId,
      //   },
      // });
      if (res.status !== 200) {
        response.status = res.status;
        response.message = res.message;
        response.data = null;
        return new Response(JSON.stringify(response));
      }
    }

    await prisma.productImages.deleteMany();
    await prisma.product.deleteMany();

    response.status = 200;
    response.message = "Products deleted successfully";
    response.data = null;
    return new Response(JSON.stringify(response));
  } catch (error: any) {
    console.log("[SERVER ERROR]: " + error.message);
    response.status = 500;
    response.message = error.message;
    response.data = null;
    return new Response(JSON.stringify(response));
  }
}

import { promises as fs } from "fs";
import path from "path";
import prisma from "@/lib/prisma";
import { SERVER_RESPONSE } from "../server";
import { v4 as uuidv4 } from "uuid";
import sharp from "sharp";

export type SERVER_IMAGE = {
  extension: string;
  sizeInBytes: string;
  dimensions: {
    width: number;
    height: number;
  };
};

async function getImageDimensions(
  image: string
): Promise<{ width: number; height: number }> {
  const sharp = require("sharp");
  try {
    // Remove the base64 prefix if present
    const base64Data = image.replace(/^data:image\/\w+;base64,/, "");

    // Convert the base64 string to a buffer
    const imageBuffer = Buffer.from(base64Data, "base64");

    // Use sharp to get the metadata (dimensions, etc.)
    const metadata = await sharp(imageBuffer).metadata();

    return { width: metadata.width || 0, height: metadata.height || 0 };
  } catch (error) {
    console.error("Error getting image dimensions:", error);
    throw error;
  }
}

export const SERVER_IMAGE_UPLOADS_DIR = "userUploads";

const base64ToImage = async (image: string) => {
  const response: any = {
    status: 500,
    message: "Image processing error",
    data: {
      extension: null,
      sizeInBytes: null,
      dimensions: null,
    },
  };

  const isBase64 = /^data:image\/(png|jpeg|jpg|gif|webp|bmp);base64,/i.test(
    image
  );
  if (!isBase64) {
    return {
      ...response,
      status: 400,
      message: "Invalid image selected",
    };
  }

  // Extract metadata
  const base64Header = image.split(",")[0];
  const imageBuffer = Buffer.from(image.split(",")[1], "base64");

  // Get image extension
  const extension =
    base64Header.match(/\/(png|jpeg|jpg|gif)/)?.[1] || "unknown";

  // Get image size in bytes
  const imageSize = imageBuffer.length; // size in bytes

  // Create an image element to get dimensions
  const imageDimensions = await getImageDimensions(image);

  const extract = {
    extension,
    sizeInBytes: imageSize,
    dimensions: imageDimensions,
  };

  response.status = 200;
  response.message = "Image successfully processed";
  response.data = { ...extract };
  return response;
};

async function create(image: string) {
  const response: SERVER_RESPONSE = {
    status: 500,
    message: "Internal Server Error",
    data: null,
  };

  const targetResponse: SERVER_RESPONSE = await base64ToImage(image);

  if (targetResponse.status !== 200) {
    console.log(`[SERVER]: ${targetResponse.message}`);
    return response;
  }

  const targetImage: SERVER_IMAGE = targetResponse.data;

  // Generate a unique filename
  const newFileName = `IMG-${uuidv4()}-${new Date().getTime()}.${
    targetImage.extension
  }`;

  // Define the directory and file path to save the image
  const uploadDir = path.join(__dirname, SERVER_IMAGE_UPLOADS_DIR); // Adjust path as necessary
  const filePath = path.join(uploadDir, newFileName);

  // Decode base64 image to binary data
  const base64Data = image.replace(/^data:image\/\w+;base64,/, ""); // Remove base64 headers
  const imageBuffer = Buffer.from(base64Data, "base64");

  // Ensure the upload directory exists
  await fs.mkdir(uploadDir, { recursive: true });

  try {
    // Write the image to the file system
    await fs.writeFile(filePath, imageBuffer);

    // Store the image data in the database
    const newImage = await prisma.images.create({
      data: {
        name: newFileName,
        extension: targetImage.extension,
        sizeInBytes: targetImage.sizeInBytes,
        width: targetImage.dimensions.width,
        height: targetImage.dimensions.height,
        url: `/${SERVER_IMAGE_UPLOADS_DIR}/${newFileName}`, // Store the relative URL
      },
    });

    if (!newImage) {
      response.status = 400;
      response.message = "Failed to save image in the database";
      response.data = null;
      return response;
    }

    response.status = 200;
    response.message = "Image saved successfully";
    response.data = newImage;
    return response;
  } catch (error) {
    console.error("Error saving image:", error);
    response.message = "Error saving image";
    return response;
  }
}

async function list(id: string) {
  const response = await prisma.images.findUnique({
    where: {
      id: id,
    },
  });
  return response;
}

async function listAll() {
  const response = await prisma.images.findMany({
    orderBy: {
      name: "asc",
    },
  });
  return response;
}

async function createBulk(images: string[]) {
  const response: SERVER_RESPONSE = {
    status: 500,
    message: "Internal Server Error",
    data: {
      successfulImages: [],
      failedImages: [],
    },
  };

  const successfulImages: SERVER_IMAGE[] = [];
  const failedImages: { image: string; reason: string }[] = [];

  let imageProcessed = 1;
  for (const image of images) {
    console.log(`processing image: ${imageProcessed}`);
    const targetResponse: SERVER_RESPONSE = await create(image);

    if (targetResponse.status === 200) {
      // Add successfully processed image to the successfulImages array
      console.log(`${imageProcessed} image processed.`);
      successfulImages.push(targetResponse.data);
    } else {
      // Add failed image info to the failedImages array
      failedImages.push({
        image, // The base64 string or image identifier
        reason: targetResponse.message, // Reason for failure
      });
      console.log(`${imageProcessed} failed`);
      console.log(targetResponse.message);
    }
  }

  // Update the response with results
  response.status = failedImages.length > 0 ? 400 : 200;
  response.message = `${successfulImages.length} files uploaded, Failed: ${failedImages.length} / ${images.length}`;
  response.data = {
    successfulImages,
    failedImages,
  };

  return response;
}

export const images = {
  create,
  createBulk,
  list,
  listAll,
};

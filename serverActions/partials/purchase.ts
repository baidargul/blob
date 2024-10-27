import axios from "axios";
import { SERVER_RESPONSE } from "../internal/server";

async function create() {
  const response: SERVER_RESPONSE = await axios.post("/api/purchase");
  return response.data;
}

async function getPrevious(id: string) {
  const response: SERVER_RESPONSE = await axios.get(
    `/api/purchase/previous?id=${id}`
  );
  return response.data;
}

async function getNext(id: string) {
  const response: SERVER_RESPONSE = await axios.get(
    `/api/purchase/next?id=${id}`
  );
  return response.data;
}

async function getFirst() {
  const response: SERVER_RESPONSE = await axios.get("/api/purchase/first");
  return response.data;
}

async function getLast() {
  const response: SERVER_RESPONSE = await axios.get("/api/purchase/last");
  return response.data;
}

async function addProduct(
  purchaseId: string,
  productId: string,
  color: string,
  cost: number,
  invoice: number,
  barcode: string
) {
  const data = {
    purchaseId,
    productId,
    color,
    cost,
    invoice,
    barcode,
  };
  const response: SERVER_RESPONSE = await axios.post(
    "/api/purchase/product/",
    data
  );
  return response.data;
}

async function updateProduct(
  id: string,
  barcode: string,
  color?: string,
  cost?: number,
  invoice?: number
) {
  const data = {
    id,
    barcode,
    color: color ? color : "",
    cost,
    invoice,
  };
  if (!barcode) {
    return {
      status: 400,
      message: "Barcode required!",
      data: null,
    };
  }
  const response: SERVER_RESPONSE = await axios.patch(
    "/api/purchase/product",
    data
  );
  return response.data;
}

async function deleteProduct(id: string) {
  const response: SERVER_RESPONSE = await axios.delete(
    `/api/purchase/product?id=${id}`
  );
  return response.data;
}

export const Purchase = {
  get: {
    previous: getPrevious,
    next: getNext,
    first: getFirst,
    last: getLast,
  },
  create,
  addProduct,
  updateProduct,
  deleteProduct,
};

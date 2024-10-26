import axios from "axios";
import { SERVER_RESPONSE } from "../internal/server";

async function create() {
  const response: SERVER_RESPONSE = await axios.post("/api/purchase");
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
    "/api/purchase/product",
    data
  );
  return response.data;
}

export const Purchase = {
  create,
  addProduct,
};

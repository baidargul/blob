import { brand, category, type } from "@prisma/client";
import axios from "axios";

async function listAll() {
  const response = await axios.get("/api/product");
  return response.data;
}

async function list(id: string) {
  const response = await axios.get(`/api/product/${id}`);
  return response.data;
}

async function findByName(name: string) {}

async function findByBarcode(barcode: string) {}

async function removeAll() {
  const response = await axios.delete("/api/product");
  return response.data;
}

async function remove(id: string) {
  const response = await axios.delete(`/api/product/x?id=${id}`);
  return response.data;
}

async function create(
  name: string,
  cost: number,
  price: number,
  brand: brand | null | any,
  category: category | null | any,
  type: type | null | any,
  images?: string[]
) {
  const data = {
    name,
    cost,
    price,
    images,
    brand,
    category,
    type,
  };

  const resposne = await axios.post("/api/product", data);
  return resposne.data;
}

export const Product = {
  create,
  remove,
  removeAll,
  list,
  listAll,
  findByName,
  findByBarcode,
};

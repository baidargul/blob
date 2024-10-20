import { category } from "@prisma/client";
import axios from "axios";

async function create(
  name: string,
  description: string,
  address1: string,
  address2: string,
  phone1: string,
  phone2: string
) {
  const data: any = {
    name,
    description,
  };
  const response = await axios.post("/api/category", data);
  return response.data;
}

async function list(id: string) {
  const response = await axios.get(`/api/category/${id}`);
  return response.data;
}

async function listAll() {
  const response = await axios.get("/api/category");
  return response.data;
}

async function remove(id: string) {
  const response = await axios.delete(`/api/category/x?id=${id}`);
  return response.data;
}

async function removeAll() {
  const response = await axios.delete("/api/category");
  return response.data;
}

export const Category = {
  create,
  list,
  listAll,
  remove,
  removeAll,
};

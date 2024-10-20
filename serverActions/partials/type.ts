import { type } from "@prisma/client";
import axios from "axios";

async function create(name: string, description: string) {
  const data: any = {
    name,
    description,
  };
  const response = await axios.post("/api/type", data);
  return response.data;
}

async function list(id: string) {
  const response = await axios.get(`/api/type/${id}`);
  return response.data;
}

async function listAll() {
  const response = await axios.get("/api/type");
  return response.data;
}

async function remove(id: string) {
  const response = await axios.delete(`/api/type/x?id=${id}`);
  return response.data;
}

async function removeAll() {
  const response = await axios.delete("/api/type");
  return response.data;
}

export const Type = {
  create,
  list,
  listAll,
  remove,
  removeAll,
};

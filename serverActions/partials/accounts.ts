import { accountType } from "@prisma/client";
import axios from "axios";
import { transactions } from "./transactions";

const APIPATH = `/api/account`;

async function createAccount(
  title: string,
  type: accountType,
  balance?: number,
  description?: string
) {
  const data = {
    title,
    type,
    description,
    balance,
  };

  console.log(data);
  const response = await axios.post(`${APIPATH}`, data);
  return response.data;
}

async function listAll() {
  const response = await axios.get(`${APIPATH}/`);
  return response.data;
}

async function list(value: string, type: "title" | "id") {
  const response = await axios.get(`${APIPATH}?${type}=${value}`);
  return response.data;
}

async function remove(id: string) {
  const response = await axios.delete(`${APIPATH}?id=${id}`);
  return response.data;
}

async function update(id: string, title: string, type: accountType) {
  const response = await axios.patch(`${APIPATH}`, {
    id,
    title,
    type: String(type).toLocaleLowerCase(),
  });
  return response.data;
}

export const Account = {
  createAccount,
  listAll,
  list,
  remove,
  update,
  transactions,
};

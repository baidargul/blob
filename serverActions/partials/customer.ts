import { accountType } from "@prisma/client";
import axios from "axios";

const APIPATH = `/api/customer`;

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
  const response = await axios.post(`${APIPATH}`, data);
  return response.data;
}

async function listAll() {
  const response = await axios.get(`${APIPATH}/`);
  return response.data;
}

async function list(value: string, type: "name" | "code" | "id") {
  const response = await axios.get(`${APIPATH}?${type}=${value}`);
  return response.data;
}

export const Customer = {
  createAccount,
  listAll,
  list,
};

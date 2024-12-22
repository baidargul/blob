import { accountType } from "@prisma/client";
import axios from "axios";

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
  const response = await axios.post(`${APIPATH}`, data);
  return response.data;
}

async function listAll() {
  const response = await axios.get(`${APIPATH}/`);
  return response.data;
}

async function list(title: string) {
  const response = await axios.get(`${APIPATH}?title=${title}`);
  return response.data;
}

export const Account = {
  createAccount,
  listAll,
  list,
};

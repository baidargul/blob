import { accountType, customer } from "@prisma/client";
import axios from "axios";
import { SERVER_RESPONSE } from "../internal/server";

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

async function assignToSale(customer: customer, saleId: string) {
  const data = {
    customer,
    saleId,
  };
  const response: SERVER_RESPONSE = await axios.post(
    `${APIPATH}/assignToPurchase`,
    { customer, saleId }
  );
  return response.data;
}

export const Customer = {
  createAccount,
  listAll,
  list,
  assignToSale,
};

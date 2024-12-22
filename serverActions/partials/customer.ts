import { accountType, customer } from "@prisma/client";
import axios from "axios";
import { SERVER_RESPONSE } from "../internal/server";

const APIPATH = `/api/customer`;

async function create(newCustomer: customer) {
  if (!newCustomer.name) return;
  const data = {
    customer: newCustomer,
  };
  const response: SERVER_RESPONSE = await axios.post(`${APIPATH}/`, data);
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
    `${APIPATH}/assignToSale/`,
    { customer, saleId }
  );
  return response.data;
}

export const Customer = {
  create,
  listAll,
  list,
  assignToSale,
};

import { vendor } from "@prisma/client";
import { SERVER_RESPONSE } from "../internal/server";
import axios from "axios";

const APIPATH = `/api/vendor/`;

async function create(newVendor: vendor) {
  if (!newVendor.name) return;
  const data = {
    vendor: newVendor,
  };
  const response: SERVER_RESPONSE = await axios.post(APIPATH, data);
  return response.data;
}

async function assignToPurchase(vendor: vendor, purchaseId: string) {
  const data = {
    vendor,
    purchaseId,
  };
  const response: SERVER_RESPONSE = await axios.post(
    `${APIPATH}/assignToPurchase`,
    { vendor, purchaseId }
  );
  return response.data;
}

async function list(id: string) {}

async function listAll() {
  const response: SERVER_RESPONSE = await axios.get(APIPATH);
  return response.data;
}

export const Vendor = {
  create,
  list,
  listAll,
  assignToPurchase,
};

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

async function list(id: string) {}

async function listAll() {}

export const Vendor = {
  create,
};

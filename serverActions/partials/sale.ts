import axios from "axios";
import { SERVER_RESPONSE } from "../internal/server";

const API_PATH = "/api/sale";

async function create() {
  const response: SERVER_RESPONSE = await axios.post(`${API_PATH}`);
  return response.data;
}
async function getPrevious(id: string) {
  const response: SERVER_RESPONSE = await axios.get(
    `/api/sale/previous?id=${id}`
  );
  return response.data;
}

async function getNext(id: string) {
  const response: SERVER_RESPONSE = await axios.get(`/api/sale/next?id=${id}`);
  return response.data;
}

async function getFirst() {
  const response: SERVER_RESPONSE = await axios.get("/api/sale/first");
  return response.data;
}

async function getLast() {
  const response: SERVER_RESPONSE = await axios.get("/api/sale/last");
  return response.data;
}

export const Sale = {
  create,
  getPrevious,
  getNext,
  getFirst,
  getLast,
};

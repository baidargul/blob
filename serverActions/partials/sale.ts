import axios from "axios";
import { SERVER_RESPONSE } from "../internal/server";

async function create() {
  const response: SERVER_RESPONSE = await axios.post("/api/sale");
  return response.data;
}

export const Sale = {
  create,
};
